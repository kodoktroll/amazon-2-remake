import moment from "moment";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/client";
import db from "../../firebase";
import Header from "../components/Header";
import Order from "../components/Order";

type OrderProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function Orders({ orders }: OrderProps) {
    const [session] = useSession();
    return (
        <div>
            <Header/>
            <main className="max-w-screen-lg mx-auto p-10">
                <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">Your Orders</h1>
                {session ? (
                    <h2>{orders.length} Orders</h2>
                ) : (
                    <h2>Please sign in to see your orders</h2>
                )}

                <div className="mt-5 space-y-4">
                    {orders?.map(({id, amount, amountShipping, items, timestamp, images}:FetchedOrder) => (
                        <Order 
                            key={id}
                            id={id}
                            amount={amount}
                            amountShipping={amountShipping}
                            items={items}
                            timestamp={timestamp}
                            images={images}
                        />
                    ))}
                </div>

            </main>
        </div>
    )
}

export default Orders;

interface FetchedOrder {
    id: string,
    amount: number,
    amountShipping: number,
    images: string[],
    timestamp: number,
    items: {
        quantity: number
    }[]
}

interface StripeItem {
    quantity: number
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // Get the users logged in credentials
    const session = await getSession(context);

    if(!session) {
        return {
            props: {}
        };
    }

    // Firebase DB
    const stripeOrders = await db.collection('users').doc(session.user.email).collection('orders').orderBy('timestamp', 'desc').get();

    //Stripe orders
    const orders: FetchedOrder[] = await Promise.all(
        stripeOrders.docs.map(async (order) => ({
            id: order.id,
            amount: order.data().amount,
            amountShipping: order.data().amount_shipping,
            images: order.data().images,
            timestamp: moment(order.data().timestamp.toDate()).unix(),
            items: (
                await stripe.checkout.sessions.listLineItems(order.id, {
                    limit:100,
                })
            ).data.map((item: StripeItem) => ({quantity: item.quantity}))
        }))
    ) 

    return {
        props: {
            orders
        }
    }
}