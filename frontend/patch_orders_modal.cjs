const fs = require('fs');
let orders = fs.readFileSync('src/pages/Orders.tsx', 'utf-8');

// The original map to table uses variables like order.customer or order.items.
// We should just map the incoming API data right after fetching it!
const hookStr = `
        const response = await orderService.getAll();
        const mappedOrders = response.data.map(order => ({
            ...order,
            id: \`ORD-\${order.id.toString().padStart(3, '0')}\`,
            originalId: order.id,
            customerName: order.customer ? \`\${order.customer.firstName} \${order.customer.lastName}\` : 'Unknown',
            customer: order.customer ? \`\${order.customer.firstName} \${order.customer.lastName}\` : 'Unknown',
            date: new Date(order.createdAt).toLocaleDateString(),
            items: order.orderItems?.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.product?.name || 'Unknown Item',
                price: item.unitPrice,
                quantity: item.quantity,
                image: item.product?.image || 'https://via.placeholder.com/150'
            })) || [],
            subtotal: order.priceTotal * 0.9,
            tax: order.priceTotal * 0.1,
            total: order.priceTotal,
            Payment: "Paid",
            status: order.status === 'DELIVERED' ? 'Delivered' : order.status === 'PENDING' ? 'Pending' : 'Canceled'
        }));
        setOrdersList(mappedOrders);
`;

orders = orders.replace(/const response = await orderService\.getAll\(\);\s+setOrdersList\(response\.data\);/, hookStr);

// Reverting previous hardcode replacements we did in orders table that assumed raw API properties
// Wait, actually if we map it, the table expects order.customer, order.date, order.items.length, order.total, order.Payment, order.status!
orders = orders.replace(/\{order\.customer \? `\$\{order\.customer\.firstName\} \$\{order\.customer\.lastName\}` : 'Unknown'\}/g, "{order.customer}");
orders = orders.replace(/\{new Date\(order\.createdAt\)\.toLocaleDateString\(\)\}/g, "{order.date}");
orders = orders.replace(/\{order\.orderItems\?\.length \|\| 0\}/g, "{order.items?.length || 0}");
orders = orders.replace(/\{order\.priceTotal\}/g, "{order.total.toFixed(2)} TND");
orders = orders.replace(/order\.status === 'DELIVERED'/g, "order.status === 'Delivered'");
orders = orders.replace(/order\.status === 'PENDING'/g, "order.status === 'Pending'");
orders = orders.replace(/order\.status === 'CANCELLED'/g, "order.status === 'Canceled'");
orders = orders.replace(/\{order\.status === 'DELIVERED' \? 'Delivered' : order\.status === 'PENDING' \? 'Pending' : 'Canceled'\}/g, "{order.status}");

fs.writeFileSync('src/pages/Orders.tsx', orders);
