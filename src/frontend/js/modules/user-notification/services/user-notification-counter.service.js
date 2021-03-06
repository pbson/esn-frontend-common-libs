const _ = require('lodash');

require('../services/providers/user-notification-providers.service.js');
require('../user-notification.constants.js');

(function(angular) {
  'use strict';

  angular.module('esn.user-notification')
    .factory('esnUserNotificationCounter', esnUserNotificationCounter);

  function esnUserNotificationCounter(
    $q,
    esnUserNotificationProviders,
    CounterFactory,
    ESN_USER_NOTIFICATION_UNREAD_REFRESH_TIMER
  ) {
    return new CounterFactory.newCounter(
      0,
      ESN_USER_NOTIFICATION_UNREAD_REFRESH_TIMER,
      _getUnreadCount
    );

    function _getUnreadCount() {
      var notificationProviders = _.values(esnUserNotificationProviders.getAll());
      var getUnreadCountPromises = notificationProviders.map(function(provider) {
        return provider.getUnreadCount();
      });

      return $q.all(getUnreadCountPromises).then(function(counts) {
        return counts.reduce(function(totalCount, count) {
          totalCount += count;

          return totalCount;
        }, 0);
      });
    }
  }
})(angular);
