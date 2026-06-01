import { static as static_ } from "express"

import { storageService } from "@/containers"

export const publicImagesFolder = static_(storageService.folderPath)