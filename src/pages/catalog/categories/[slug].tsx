import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import { client } from "../../../lib/prismic";
import PrismicDom from "prismic-dom";
import Prismic from "prismic-javascript";
import { Document } from "prismic-javascript/types/documents";
import Link from "next/link";

interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  category: Document;
  products: Document[];
}

export default function Category({ products, category }: CategoryProps) {
  const { query, isFallback } = useRouter();

  if (isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <h1>{PrismicDom.RichText.asText(category.data.title)}</h1>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/catalog/products/${product.uid}`}>
              <a>{PrismicDom.RichText.asText(product.data.title)}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

/* Páginas estáticas dinâmicas */
// export const getStaticPaths: GetStaticPaths = async () => {
//   const response = await fetch(`http://localhost:3333/categories`);
//   const categories = await response.json();

//   const paths = categories.map((category) => ({
//     params: { slug: category.id },
//   }));

//   return {
//     paths,
//     fallback: true,
//   };
// };

// export const getStaticProps: GetStaticProps<CategoryProps> = async (
//   context
// ) => {
//   const { slug } = context.params;

//   const response = await fetch(
//     `http://localhost:3333/products?category_id=${slug}`
//   );
//   const products = await response.json();

//   return {
//     props: {
//       products,
//     },
//     revalidate: 120,
//   };
// };

/* Consumindo do Prismac */

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at("document.type", "category"),
  ]);

  const paths = categories.results.map((category) => ({
    params: { slug: category.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const { slug } = context.params;

  const category = await client().getByUID("category", String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at("document.type", "product"),
    Prismic.Predicates.at("my.product.category", category.id),
  ]);

  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 120,
  };
};
