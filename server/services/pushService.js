import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:alerts@pulsenews.live';

if (vapidPublicKey && vapidPrivateKey) {
    try {
        webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
        console.log('[PushService] Web Push VAPID keys initialized.');
    } catch (err) {
        console.warn('[PushService] VAPID configuration warning:', err.message);
    }
} else {
    console.log('[PushService] VAPID keys not configured in environment.');
}

export const sendPushNotification = async (subscription, payload) => {
    if (!subscription || !subscription.endpoint) {
        return { success: false, error: 'No active push subscription' };
    }

    try {
        const pushPayload = JSON.stringify(payload);
        const result = await webpush.sendNotification(subscription, pushPayload);
        return { success: true, result };
    } catch (error) {
        console.error('[PushService] Error sending push notification:', error.message);
        return { success: false, error: error.message };
    }
};

export { vapidPublicKey };
