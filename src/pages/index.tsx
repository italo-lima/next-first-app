import { Title } from "../styles/pages/Home";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import SEO from "../components/SEO";
import { client } from "../lib/prismic";
import Prismic from "prismic-javascript";
import PrismicDom from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {
  /* Client Side Fetching
  const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([])

  useEffect(() => {
    fetch('http://localhost:3333/recommended').then(response => {
      response.json().then(data => {
        setRecommendedProducts(data)
      })
    })
  }, []) */

  return (
    <>
      <SEO
        title="DevCommerce, o melhor!"
        image="boost.png"
        shouldExcludeTitleSuffix
      />
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map((product) => (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>{PrismicDom.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/* Server Side Rendering */
// export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/recommended`
//   );
//   const recommendedProducts = await response.json();

//   return {
//     props: {
//       recommendedProducts,
//     },
//   };
// };

/* Buscando informações do Prismic */
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at("document.type", "product"),
  ]);

  console.log(recommendedProducts.results[0].data.title);
  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  };
};
