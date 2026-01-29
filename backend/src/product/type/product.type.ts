import { Product } from "../../../generated/prisma/client"

export type AfterUploadProduct = Omit<Product, 'keyName'> & { url: string }