
// Notification configuration using switch-case
function getNotificationConfig(type:string, itemName:string) {
    switch (type) {
        case 'wishlist':
            return {
                type: 'wishlist',
                title: 'Added to Wishlist',
                message: `${itemName} added to your wishlist`,
                icon_class: 'fas fa-heart',
                icon_background: '#3b82f6'
            };
        case 'cart':
            return {
                type: 'cart',
                title: 'Added to Cart',
                message: `${itemName} added to your cart`,
                icon_class: 'fas fa-shopping-cart',
                icon_background: '#10b981'
            };
        case 'profile':
            return {
                type: 'profile',
                title: 'Profile Updated',
                message: 'Your profile information was updated',
                icon_class: 'fas fa-user',
                icon_background: '#f59e0b'
            };
        case '2fa_enable':
            return {
                type: '2fa_enable',
                title: '2FA Enabled',
                message: 'Two-factor authentication has been enabled',
                icon_class: 'fas fa-shield-alt',
                icon_background: '#8b5cf6'
            };
        case '2fa_disable':
            return {
                type: '2fa_disable',
                title: '2FA Disabled',
                message: 'Two-factor authentication has been disabled',
                icon_class: 'fas fa-shield-alt',
                icon_background: '#ef4444'
            };
        case 'order_created':
            return {
                type: 'order_created',
                title: 'Order Created',
                message: `Order for ${itemName} has been created`,
                icon_class: 'fas fa-shopping-bag',
                icon_background: '#6366f1'
            };
        case 'order_shipped':
            return {
                type: 'order_shipped',
                title: 'Order Shipped',
                message: `Order for ${itemName} has been shipped`,
                icon_class: 'fas fa-truck',
                icon_background: '#06b6d4'
            };
        case 'order_delivered':
            return {
                type: 'order_delivered',
                title: 'Order Delivered',
                message: `Order for ${itemName} has been delivered`,
                icon_class: 'fas fa-check-circle',
                icon_background: '#22c55e'
            };
        case 'order_cancelled':
            return {
                type: 'order_cancelled',
                title: 'Order Cancelled',
                message: `Order for ${itemName} has been cancelled`,
                icon_class: 'fas fa-times-circle',
                icon_background: '#ef4444'
            };
        case 'order_failed':
            return {
                type: 'order_failed',
                title: 'Order Failed',
                message: `Order for ${itemName} has been failed`,
                icon_class: 'fas fa-times-circle',
                icon_background: '#ef4444'
            };
        case 'coupon':
            return {
                type: 'coupon',
                title: 'New Coupon Available',
                message: itemName,
                icon_class: 'fas fa-ticket-alt',
                icon_background: '#ec4899'
            };
        case 'announcement':
            return {
                type: 'announcement',
                title: 'Announcement',
                message: itemName,
                icon_class: 'fas fa-bullhorn',
                icon_background: '#f97316'
            };
        case 'password_reset':
            return {
                type: 'password_reset',
                title: 'Password Reset',
                message: 'Your password has been successfully reset',
                icon_class: 'fas fa-key',
                icon_background: '#4b5563'
            };
        default:
            throw new Error('Invalid notification type');
    }
}