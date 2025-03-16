// resources/js/setupEcho.js (или как называется ваш файл)
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';
import { pusherConfig } from './pusherConfig'; // Импорт конфигурации

function setupEcho() {
  window.Pusher = Pusher;
  window.Echo = new Echo({
    authEndpoint: pusherConfig.authEndpoint,
    broadcaster: 'pusher',
    key: pusherConfig.key,
    cluster: pusherConfig.cluster,
    forceTLS: pusherConfig.forceTLS,
    encrypted: pusherConfig.encrypted,
    enabledTransports: pusherConfig.enabledTransports,
    authorizer: (channel, options) => {
      return {
        authorize: (socketId, callback) => {
          axios.post(pusherConfig.authEndpoint, {
            socket_id: socketId,
            channel_name: channel.name
          })
            .then(response => {
              callback(null, response.data);
            })
            .catch(error => {
              callback(error);
            });
        }
      };
    },
  });
}

export default setupEcho;
