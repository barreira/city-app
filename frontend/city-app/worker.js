self.addEventListener('push', e => {
  const data = e.data.json();

  self.registration.showNotification(data.title, {
    body: 'Notified by trololol',
    icon: './src/assets/launch_icon.png'
  });
});