self.addEventListener('push', e => {
  const data = e.data.json();

  self.registration.showNotification(data.title, {
    body: 'Notified by trololol54554',
    icon: './src/assets/city.png'
  });
});