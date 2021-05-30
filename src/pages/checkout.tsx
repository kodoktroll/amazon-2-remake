import Image from "next/image";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import CheckoutProduct from "../components/CheckoutProduct";
import Currency from 'react-currency-formatter';
import { selectItems, selectTotal } from "../slices/basketSlice";
import { useSession } from "next-auth/client";

function Checkout() {
    const [session] = useSession();
    const items = useSelector(selectItems);
    const total = useSelector(selectTotal);
    const groupedItems = Object.values(items.reduce((r, a) => {
        r[a.id] = [...r[a.id] || [], a]
        return r
    }, {}));
    return (
        <div className="bg-gray-100">
            <Header/>
            <main className="lg:flex max-w-screen-2xl mx-auto">
                {/* left */}
                <div className="flex-grow m-5 shadow-sm">
                    <Image 
                        src="https://links.papareact.com/ikj"
                        width={1020}
                        height={250}
                        objectFit="contain"
                    />
                    <div className="flex flex-col p-5 space-y-10 bg-white">
                        <h1 className ="text-3xl border-b pb-4">{items.length === 0 ? "Your Amazon Basket is Empty" : "Shopping Basket"}</h1>
                        {groupedItems.map((group: any[], i) => (
                            <CheckoutProduct 
                                key={i}
                                id={group[0].id}
                                title={group[0].title}
                                price={group[0].price} 
                                rating={group[0].rating}
                                description={group[0].description}
                                category={group[0].category}
                                image={group[0].image}
                                hasPrime={group[0].hasPrime}
                                quantity={group.length}
                            />
                        ))}
                    </div>
                </div>

                {/* right */}
                <div className="flex flex-col bg-white p-10 shadow-md">
                    {items.length > 0 && (
                        <>
                            <h2 className="whitespace-nowrap">Subtotal ({items.length} items):</h2>
                            <span className="font-bold">
                                <Currency quantity={total} currency="USD"/>
                            </span>

                            <button 
                                disabled={!session}
                                className={`button mt-2 ${!session && "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"}`}>
                                    {!session ? "Sign in to check out" : "Proceed to checkout"}
                            </button>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Checkout
