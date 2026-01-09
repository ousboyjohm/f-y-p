export interface Category {
    id: number,
    name: string,
    description: string
}

export interface User {
    id: number,
    name: string,
    username: string,
    password: string,
    role: string,
    address: string,
    phoneNumber: string
}

export interface Product {
    id: number,
    name: string,
    description: string,
    pricePerUnit: number,
    stockQuantity: number,
    imageUrl: string
    category: Category,
    seller: User
}

export interface Cart {
    id: number,
    customer: User
}

export interface CartItem {
    id: number,
    cart: Cart,
    product: Product,
    quantity: number
}

export interface ShippingDetails {
    id: number,
    address: string,
    phone_number: string,
    city: string,
    postal_code: string
}

export interface Order {
    id: number,
    orderStatus: string,
    orderDate: Date,
    totalPrice: number,
    shippingAddress: string,
    customer: User
}


export interface OrderItem {
    id: number,
    quantity: number,
    priceAtPurchase: number,
    product: Product,
    order: Order
}