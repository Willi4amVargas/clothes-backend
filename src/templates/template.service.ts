import { readFile } from "fs/promises";
import { compile } from "handlebars";
import path from "path";

export class TemplateService {
  private templatesPath: string;
  constructor() {
    this.templatesPath = path.join(__dirname, "./");
  }
  /**
  * Renderiza una plantilla de Handlebars (.hbs) inyectando los datos del contexto proporcionado.
  * 
  * @param template - Nombre o ruta de la plantilla (sin la extensión .hbs).
  * @param context - Objeto con los datos que se inyectarán en la plantilla.
  * @returns Promesa que resuelve al HTML renderizado como string.
  * @throws Error si no se encuentra el archivo o falla el renderizado.
  */
  render = async (template: string, context: any): Promise<string> => {
    try {
      const templateFileName = template.endsWith(".hbs")
        ? template
        : `${template}.hbs`;
      const templatePath = path.join(this.templatesPath, templateFileName);
      const templateContent = await readFile(templatePath, "utf-8");
      const compiledTemplate = compile(templateContent);
      const renderedHtml = compiledTemplate(context);

      return renderedHtml;
    } catch (error: any) {
      throw new Error(
        `Error al renderizar el template ${template}: ${error.message}`,
      );
    }
  };
}
