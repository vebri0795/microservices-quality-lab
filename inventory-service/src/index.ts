import { createApp } from './app';

const PORT = process.env.PORT || 4001;
createApp().listen(PORT, () => console.log(`inventory-service listening on ${PORT}`));
