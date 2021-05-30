import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import Banner from '../components/Banner';
import ProductFeed from '../components/ProductFeed';
import { GetServerSideProps } from 'next';
// import styles from '../styles/Home.module.css'

export default function Home({ products }) {
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
  const products = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json()
  );
  
  return {
    props: {
      products
    }
  }
}