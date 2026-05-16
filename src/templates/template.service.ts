import path from "path";
import { readFile } from "fs/promises";
import { compile } from "handlebars";

export class TemplateService {
  private templatesPath: string;
  constructor() {
    this.templatesPath = path.join(__dirname, "./");
  }

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
