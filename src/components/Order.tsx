import moment from "moment";
import Currency from "react-currency-formatter";

type OrderProps = {
    id: string,
    amount: number,
    amountShipping: number,
    items: {
        quantity: number
    }[],
    timestamp: number,
    images: string[]
}

function Order({id, amount, amountShipping, items, timestamp, images}: OrderProps) {
    return (
        <div className="relative border rounded-md">
            <div className="flex items-center space-x-10 p-5 bg-gray-100 text-sm text-gray-600">
                <div>
                    <p className="font-bold text-xs">Order placed</p>
                    <p>{moment.unix(timestamp).format('DD MMM YYYY')}</p>
                </div>
                <div>
                    <p className="text-xs font-bold">Total</p>
                    <p>
                        <Currency quantity={amount} currency="USD"/> - Next Day Delivery{" "}
                        <Currency quantity={amountShipping} currency="USD"/>
                    </p>
                </div>
                <p className="text-sm whitespace-nowrap sm:text-xl self-end flex-1 text-right text-blue-500">{items.reduce((prev, curr) => ({quantity: curr.quantity + prev.quantity}), {quantity: 0}).quantity} items</p>
                <p className="absolute top-2 right-2 w-40 lg:w-72 truncate text-xs whitespace-nowrap">ORDER # {id}</p>
            </div>
            <div className="p-5 sm:p-10">
                <div className="flex space-x-6 overflow-auto">
                    {images.map((image, i) => (
                        <div key={i} className="p-5">
                            <img src={image} alt="image" className="h-20 object-contain sm:h-32 mb-2"/>
                            <p className="text-center text-sm font-bold">x {items[i].quantity}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Order
