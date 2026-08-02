import { module_types, modules } from "#/client";
import { repository } from "@/config/prisma";

export class NumerationService {
  constructor() {}
  // esto deberia obtener la numeracion de manera logica por ejemplo si se pide el modulo INVENTORY_OPERATION, por consiguiente se deberan obtener unicamente los tipos de ese modulo como LOAD o DOWNLOAD UNICAMENTE
  // por ahora no importara si se genera mal :D despues se solucionara
  getByModuleAndType = async (module: modules, type: module_types) => {
    try {
      // si no existe se crea
      const result = await repository.numeration.findFirst({
        where: {
          module,
          type,
        },
      });
      if (!result) {
        const newNumeration = await repository.numeration.create({
          data: {
            module,
            type,
          },
        });
        return newNumeration;
      }
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting numeration");
    }
  };
  updatePrefix = async (
    module: modules,
    type: module_types,
    prefix: string,
  ) => {
    try {
      const result = await repository.numeration.update({
        where: { type, module },
        data: {
          prefix,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating numeration");
    }
  };

  // IDK if use last value created to this xd
  updateNumeration = async (
    module: modules,
    type: module_types,
    numeration: number,
  ) => {
    try {
      const result = await repository.numeration.update({
        where: { type, module },
        data: {
          last_numeration: numeration,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating numeration");
    }
  };
}
