const { onRequest } = require('firebase-functions/v2/https');
const { auth } = require("firebase-functions/v1");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
initializeApp();
const db = getFirestore();

// Add new users to 'users' collection
exports.newUserToDb = auth.user().onCreate((user) => {
    try {
        db.collection('users').doc(user.uid).set({
            email: user.email,
            displayName: user.displayName || "",
            photoUrl: user.photoURL || "",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        logger.info(`User ${user.uid} added to Firestore successfully`);
    } catch (error) {
        logger.error(`Error adding user to Firestore: ${error.message}`);
    }
});

// Delete users from Firestore when account deleted
exports.deleteUserFromDb = auth.user().onDelete((user) => {
    try {
        db.collection('users').doc(user.uid).delete()
        logger.info(`User ${user.uid} deleted from Firestore successfully`);
    } catch (error) {
        logger.error(`Error deleting user from Firestore: ${error.message}`);
    }
})

// Function to sync existing Firebase Auth users to Firestore
exports.syncUsersToFirestore = onRequest(async (_, res) => {
    const auth = admin.auth();

    try {
        let nextPageToken;
        do {
            const listUsersResult = await auth.listUsers(1000, nextPageToken);
            const batch = db.batch();

            listUsersResult.users.forEach(userRecord => {
                const { uid, email, displayName, photoURL } = userRecord;

                const userDoc = db.collection('users').doc(uid);

                batch.set(userDoc, {
                    email: email || "",
                    displayName: displayName || "",
                    photoUrl: photoURL || "",
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
            });

            await batch.commit();
            logger.info('Batch committed successfully.');

            nextPageToken = listUsersResult.pageToken;
        } while (nextPageToken);

        res.status(200).send('All users have been synced to Firestore.');
    } catch (error) {
        logger.error(`Error syncing users: ${error.message}`);
        res.status(500).send('Failed to sync users.');
    }
});
