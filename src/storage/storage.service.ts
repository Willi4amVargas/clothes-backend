import { existsSync, mkdirSync } from "node:fs";
import { unlink, writeFile } from 'node:fs/promises';
import path from "node:path";

export class StorageService {
  constructor(public folderPath: string = path.join(process.cwd(), "public")) {
    if (!existsSync(this.folderPath)) {
      mkdirSync(this.folderPath, { recursive: true });
    }
  }

  /**
   * Elimina un archivo especificando su nombre completo (con extensión)
   */
  delete = async (fileNameWithExt: string): Promise<void> => {
    const filePath = path.join(this.folderPath, fileNameWithExt);
    try {
      await unlink(filePath);
      console.log(`Successfully deleted ${filePath}`);
    } catch (error: any) {
      console.error('Error deleting file:', error.message);
      throw error;
    }
  }

  /**
   * Guarda un archivo recuperando dinámicamente su extensión original
   * @param customName El nombre que le quieras dar (sin extensión)
   * @param file El archivo proveniente de Multer
   * @returns El nombre final del archivo guardado (nombre + extensión)
   */
  save = async (customName: string, file: Express.Multer.File): Promise<string> => {
    const fileExt = path.extname(file.originalname);

    const finalFileName = `${customName}${fileExt}`;
    const filePath = path.join(this.folderPath, finalFileName);

    try {
      await writeFile(filePath, file.buffer);
      return finalFileName;
    } catch (error: any) {
      console.error('Error saving file:', error.message);
      throw error;
    }
  };
}