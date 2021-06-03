import Head from 'next/head';
import Header from '../components/Header';
import Banner from '../components/Banner';
import ProductFeed from '../components/ProductFeed';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/client';
// import styles from '../styles/Home.module.css'

type Product = {
  id: string,
  title: string,
  price: number,
  description: string,
  category: string,
  image: string
}

export default function Home({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="bg-gray-100">

      <Head>
        <title>Amazon 2.0 Remake</title>
        <meta name="description" content="Amazon remake" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* HEADER */}
      <Header/>

      {/* main */}
      <main className='max-w-screen-2xl mx-auto'>

        {/* banner */}
        <Banner/>

        {/* product feed */}
        <ProductFeed products={products}/>
      </main>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const products: Product[] = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json()
  );
  
  return {
    props: {
      products,
      session
    }
  }
}