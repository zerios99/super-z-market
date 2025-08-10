import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";
import z from "zod";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          ...where.price,
          less_than_equal: input.maxPrice,
        };
      }

      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const subcategoriesSlugs = [];

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subcategories: undefined,
          })),
        }));

        const parentCategory = formattedData[0];
        if (parentCategory) {
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1,
        where,
      });
      return data;
    }),
});

// import { Category } from "@/payload-types";
// import { baseProcedure, createTRPCRouter } from "@/trpc/init";
// import type { Where } from "payload";
// import { z } from "zod";

// export const productsRouter = createTRPCRouter({
//   getMany: baseProcedure
//     .input(
//       z.object({
//         category: z.string().nullable().optional(),
//         minPrice: z.string().nullable().optional(),
//         maxPrice: z.string().nullable().optional(),
//       })
//     )
//     .query(async ({ ctx, input }) => {
//       const where: Where = {};

//       // التعامل مع فلتر السعر
//       const priceWhere: Record<string, number> = {};

//       const hasMin =
//         input.minPrice != null &&
//         input.minPrice.trim() !== "" &&
//         !Number.isNaN(Number(input.minPrice));

//       const hasMax =
//         input.maxPrice != null &&
//         input.maxPrice.trim() !== "" &&
//         !Number.isNaN(Number(input.maxPrice));

//       let min = hasMin ? Number(input.minPrice) : undefined;
//       let max = hasMax ? Number(input.maxPrice) : undefined;

//       // إذا كان كلاهما موجود والقيم مقلوبة، يتم تبديلها
//       if (min != null && max != null && min > max) {
//         [min, max] = [max, min]; // استخدام destructuring assignment
//       }

//       if (min != null) {
//         priceWhere.greater_than_equal = min;
//       }
//       if (max != null) {
//         priceWhere.less_than_equal = max;
//       }

//       if (Object.keys(priceWhere).length > 0) {
//         where.price = priceWhere;
//       }

//       // التعامل مع فلتر الفئة
//       if (input.category && input.category.trim() !== "") {
//         try {
//           const categoriesData = await ctx.db.find({
//             collection: "categories",
//             limit: 1,
//             depth: 1,
//             pagination: false,
//             where: {
//               slug: {
//                 equals: input.category.trim(),
//               },
//             },
//           });

//           if (categoriesData.docs.length > 0) {
//             const subcategoriesSlugs: string[] = [];

//             const formattedData = categoriesData.docs.map((doc) => ({
//               ...doc,
//               subcategories: (doc.subcategories?.docs ?? []).map((subDoc) => ({
//                 ...(subDoc as Category),
//                 subcategories: undefined,
//               })),
//             }));

//             const parentCategory = formattedData[0];
//             if (parentCategory) {
//               // جمع slugs للفئات الفرعية
//               if (parentCategory.subcategories) {
//                 subcategoriesSlugs.push(
//                   ...parentCategory.subcategories
//                     .map((subcategory) => subcategory.slug)
//                     .filter((slug): slug is string => slug != null)
//                 );
//               }

//               // إضافة فلتر الفئة
//               where["category.slug"] = {
//                 in: [parentCategory.slug, ...subcategoriesSlugs].filter(
//                   (slug): slug is string => slug != null
//                 ),
//               };
//             }
//           }
//         } catch (error) {
//           console.error("خطأ في جلب الفئات:", error);
//           // يمكن إضافة معالجة خطأ مناسبة هنا
//         }
//       }

//       try {
//         const data = await ctx.db.find({
//           collection: "products",
//           depth: 1,
//           where,
//         });

//         return data;
//       } catch (error) {
//         console.error("خطأ في جلب المنتجات:", error);
//         throw new Error("فشل في جلب المنتجات");
//       }
//     }),
// });
