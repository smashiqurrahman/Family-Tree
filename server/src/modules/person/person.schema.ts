import { z } from "zod";

export const createPersonSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Person name must be at least 2 characters")
      .max(100, "Person name must not exceed 100 characters"),

    gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]).optional(),

    birthDate: z.string().date("Birth date must be a valid date").optional(),

    deathDate: z.string().date("Death date must be a valid date").optional(),

    photo: z.string().trim().url("Photo must be a valid URL").optional(),

    bio: z
      .string()
      .trim()
      .max(5000, "Biography must not exceed 5000 characters")
      .optional(),
  }),

  params: z.object({
    treeId: z.coerce
      .number()
      .int("Tree ID must be an integer")
      .positive("Tree ID must be positive"),
  }),

  query: z.object({}),
});

export type CreatePersonInput = z.infer<typeof createPersonSchema>;

export const getPersonsSchema = z.object({
  params: z.object({
    treeId: z.coerce
      .number()
      .int("Tree ID must be an integer")
      .positive("Tree ID must be positive"),
  }),

  query: z.object({}),
});

export type GetPersonsInput = z.infer<typeof getPersonsSchema>;

export const getPersonSchema = z.object({
  //   body: z.object({}),

  params: z.object({
    treeId: z.coerce
      .number()
      .int("Tree ID must be an integer")
      .positive("Tree ID must be positive"),

    personId: z.coerce
      .number()
      .int("Person ID must be an integer")
      .positive("Person ID must be positive"),
  }),

  query: z.object({}),
});

export type GetPersonInput = z.infer<typeof getPersonSchema>;

export const updatePersonSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Person name must be at least 2 characters")
        .max(100, "Person name must not exceed 100 characters")
        .optional(),

      gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]).optional(),

      birthDate: z.string().date("Birth date must be a valid date").optional(),

      deathDate: z.string().date("Death date must be a valid date").optional(),

      photo: z.string().trim().url("Photo must be a valid URL").optional(),

      bio: z
        .string()
        .trim()
        .max(5000, "Biography must not exceed 5000 characters")
        .optional(),
    })
    .refine(
      (data) =>
        data.name !== undefined ||
        data.gender !== undefined ||
        data.birthDate !== undefined ||
        data.deathDate !== undefined ||
        data.photo !== undefined ||
        data.bio !== undefined,
      {
        message: "At least one field is required to update the person",
      },
    )
    .refine(
      (data) => {
        if (!data.birthDate || !data.deathDate) {
          return true;
        }

        return new Date(data.birthDate) <= new Date(data.deathDate);
      },
      {
        message: "Birth date cannot be after death date",
      },
    ),

  params: z.object({
    treeId: z.coerce
      .number()
      .int("Tree ID must be an integer")
      .positive("Tree ID must be positive"),

    personId: z.coerce
      .number()
      .int("Person ID must be an integer")
      .positive("Person ID must be positive"),
  }),

  query: z.object({}),
});

export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
