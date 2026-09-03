import { z } from "zod";

export const createTreeSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Tree name must be at least 2 characters")
      .max(100, "Tree name must not exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(1000, "Description must not exceed 1000 characters")
      .optional(),

    coverImage: z
      .string()
      .trim()
      .url("Cover image must be a valid URL")
      .optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

export type CreateTreeInput = z.infer<typeof createTreeSchema>;


export const getTreeSchema = z.object({
  params: z.object({
    treeId: z.coerce
      .number()
      .int("Tree ID must be an integer")
      .positive("Tree ID must be positive"),
  }),
  query: z.object({}),
});

export type GetTreeInput = z.infer<typeof getTreeSchema>;


export const updateTreeSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Tree name must be at least 2 characters")
        .max(100, "Tree name must not exceed 100 characters")
        .optional(),

      description: z
        .string()
        .trim()
        .max(1000, "Description must not exceed 1000 characters")
        .optional(),

      coverImage: z
        .string()
        .trim()
        .url("Cover image must be a valid URL")
        .optional(),
    })
    .refine(
      (data) =>
        data.name !== undefined ||
        data.description !== undefined ||
        data.coverImage !== undefined,
      {
        message: "At least one field is required to update the tree",
      },
    ),

  params: z.object({
    treeId: z.coerce
      .number()
      .int("Tree ID must be an integer")
      .positive("Tree ID must be positive"),
  }),

  query: z.object({}),
});

export type UpdateTreeInput = z.infer<typeof updateTreeSchema>;