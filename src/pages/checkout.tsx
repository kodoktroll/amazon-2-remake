import Image from "next/image";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import CheckoutProduct from "../components/CheckoutProduct";
import Currency from 'react-currency-formatter';
import { selectItems, selectTotal } from "../slices/basketSlice";
import { useSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
const stripePromise = loadStripe(process.env.stripe_public_key);

function Checkout() {
    const [session] = useSession();
    const items = useSelector(selectItems);
    const total = useSelector(selectTotal);
    const groupedItems = Object.values(items.reduce((r, a) => {
        r[a.id] = [...r[a.id] || [], a]
        return r
    }, {}));

    const checkoutItems = groupedItems.map((item: any[]) => ({
        id: item[0].id,
        title: item[0].title,
        price: item[0].price ,
        rating: item[0].rating,
        description: item[0].description,
        category: item[0].category,
        image: item[0].image,
        hasPrime: item[0].hasPrime,
        quantity: item.length
    }));

    const createCheckoutSession = async () => {
        const stripe = await stripePromise;

        const checkoutSession = await axios.post('/api/create-checkout-session', {
            items: checkoutItems,
            email: session.user.email
        });

        // redirect to stripe checkout
        const result = await stripe.redirectToCheckout({
            sessionId: checkoutSession.data.id
        });

        if (result.error) {
            alert(result.error.message);
        }
    }

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
                        {checkoutItems.map((item, i) => (
                            <CheckoutProduct 
                                key={i}
                                id={item.id}
                                title={item.title}
                                price={item.price} 
                                rating={item.rating}
                                description={item.description}
                                category={item.category}
                                image={item.image}
                                hasPrime={item.hasPrime}
                                quantity={item.quantity}
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
                                role="link"
                                disabled={!session}
                                onClick={createCheckoutSession}
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
