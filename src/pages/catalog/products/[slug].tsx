import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState } from "react";
import PrismicDom from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";
import { GetStaticPaths, GetStaticProps } from "next";
import { client } from "../../../lib/prismic";

interface ProductProps {
  product: Document;
}

//Carregando components dinamicamente (só importa quando for usado)
const AddToCartModal = dynamic(
  () => import("../../../components/AddToCartModal"),
  { loading: () => <p>Loading...</p> }
);

export default function Product({ product }: ProductProps) {
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  const { query, isFallback } = useRouter();

  function handleAddToCart() {
    setIsAddToCartModalVisible(true);
  }

  if (isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>{PrismicDom.RichText.asText(product.data.title)}</h1>

      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDom.RichText.asHtml(product.data.description),
        }}
      ></div>

      <img
        src={product.data.thumbnail.url}
        width="600"
        alt="Camisa front-end"
      />

      <p>Price: ${product.data.price}</p>

      <button onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddToCartModal />}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID("product", String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 10,
  };
};
