self.addEventListener('push', function(event) {
    const options = {
        body: event.data.text(),
        icon: 'https://yowl.ct.ws/assets/images/icon.png',
        badge: 'https://yowl.ct.ws/assets/images/icon.png'
    };

    event.waitUntil(
        self.registration.showNotification('New Message', options)
    );
});
