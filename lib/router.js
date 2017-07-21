const _ = require('lodash');
const async = require('async');

const ucwords = (value) => `${value[0].toUpperCase()}${value.substring(1)}`;
const INTERRUPT = Error('interrupt');

/**
 * 路由器初始化
 *  params
 *  server object restify.createServer()
 *  controller ./controller
 *  defaults 默认控制器方法
 */
module.exports = (server, ctls, defaults, opts) => {
  const apis = [];

  /** 判断是否需要提供apis的查询接口 */
  if (opts.apis) {
    server.get(opts.apis, (req, res, next) => {
      res.send(apis);
      next();
    });
  }

  /**
   * 执行 ors, 即只要有一个没有返回错误就算通过
   * 一般用于权限验证，比如某个操作既可以管理员
   * 又可以是资源拥有者，又可以是私有IP
   */
  const actionOrs = (actions, req, res, next) => {
    /**  循环顺序处理，如果遇到执行成功的则中断 */
    async.mapSeries(actions, (action, callback) => {
      try {
        action(req, res, (error) => {
          callback(error ? null : INTERRUPT, error);
        });
      } catch (e) {
        console.error(new Date(), e, e.stack);
        callback(e);
      }
    }, (error, results) => {
      if (error) {
        /** 如果错误是中断信号，则直接调用next */
        if (error === INTERRUPT) return next();
        return next(error);
      }
      /** 找到第一个错误直接返回 */
      return next(_.find(results, (x) => x));
    });
  };

  const register = (verb, routePath, ctlAct) => {
    /**
     * 暂存起来，提供给apis接口来用
     *  apis接口用来返回当前 services 提供的可用的 api
     */
    apis.push(`[${verb.toUpperCase()}] ${routePath}`);

    const ctl = ctlAct.split('#')[0];
    const action = ctlAct.split('#')[1];
    const evtName = `${ctl}_${action}`;
    let actions;

    /** 如果定义的对应的控制器，也有对应的方法则使用该方法 */
    if (ctls[ctl] && ctls[ctl][action]) actions = ctls[ctl][action];

    /** 反之则使用默认的方法来处理 */
    if (!actions && defaults && defaults[action]) actions = defaults[action](ctl);

    /** 如果都没有则抛出异常 */
    if (!actions) throw Error(`Missing controller method:${ctl}#${action}`);

    /** 强制把actions处理成一个数组 */
    if (!_.isArray(actions)) actions = [actions];

    /** 过滤掉空 */
    actions = _.compact(actions);

    /** 将每一个action都用try catch处理 */
    actions = _.map(actions, (act) => (
      (req, res, next) => {
        req.route.evtName = evtName;
        if (_.isArray(act)) return actionOrs(act, req, res, next);
        try {
          return act(req, res, next);
        } catch (e) {
          console.error(new Date(), e, e.stack);
          return next(e);
        }
      }
    ));
    server[verb](...[routePath].concat(actions));
  };

  const router = {};
  _.each(['get', 'post', 'put', 'patch', 'del'], (verb) => {
    router[verb] = (routePath, ctlAct) => {
      register(verb, routePath, ctlAct);
    };
  });

  /**
   * controller 为可选参数，如果不填写则控制器名称直接就是 res ，方法为 list,add
   * 如果设置了controller 则控制器为 controller，方法为 #{res}s, add{Res}
   */
  router.collection = (res, _routePath, controller) => {
    let routePath = _routePath;
    if (_routePath == null) {
      if (controller) {
        routePath = `/${controller}s/:${controller}Id/${res}s`;
      } else {
        routePath = `/${res}s`;
      }
    }
    if (controller) {
      register('get', routePath, `${controller}#${res}s`);
      register('post', routePath, `${controller}#add${ucwords(res)}`);
    } else {
      register('get', routePath, `${res}#list`);
      register('post', routePath, `${res}#add`);
    }
  };

  router.model = (res, routePath = `/${res}s/:id`) => {
    register('get', routePath, `${res}#detail`);
    register('put', routePath, `${res}#modify`);
    register('patch', routePath, `${res}#modify`);
    register('del', routePath, `${res}#remove`);
  };

  router.resource = (res, routePath = `/${res}s`) => {
    router.collection(res, routePath);
    router.model(res, `${routePath}/:id`);
  };

  return router;
};
