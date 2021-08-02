import fetch from 'node-fetch';

const TOPIC_METER_UPDATED = 'emc2/transparency/dashboard/meter_updated';

export default class EnergyBase {
  #url;
  #password;

  #cookie;
  #subscriberId;

  #state = {
    currentUsage: 0,
    networkToHouse: 0,
    houseToNetwork: 0,
    solar: 0,
    ownConsumePercentage: 100,
  };

  constructor({ url, password }) {
    this.#url = url;
    this.#password = password;
  }

  async connect() {
    console.group("EnergyBase Connection start");
    await this.login();
    await this.subscribe();
    console.groupEnd();
  }

  async login() {
    const url = `${this.#url}/rs/login?login`;
    console.log(`Logging Into ${url}`);
    const resp = await fetch(url, {
      method: 'post',
      body: JSON.stringify([this.#password]),
    });
    const cookies = resp.headers.raw()['set-cookie'];
    this.#cookie = cookies[cookies.length - 1].split(';')[0];
    console.log('Login Complete');
    return await resp.json();
  }

  async subscribe() {
    console.log('Subscribing to topics');
    const resp = await fetch(`${this.#url}/rs/events?subscribe`, {
      method: 'post',
      body: JSON.stringify([[TOPIC_METER_UPDATED], '']),
      headers: { cookie: this.#cookie },
    });
    const res = await resp.json();
    this.#subscriberId = res.result;
    console.log('Subscribing successful');
    return res;
  }

  async update() {
    let resp = await fetch(`${this.#url}/rs/events?longPoll`, {
      method: 'post',
      body: JSON.stringify([this.#subscriberId, 10]),
      headers: { cookie: this.#cookie },
    });
    if (!resp.ok) {
      await this.connect();
      resp = await fetch(`${this.#url}/rs/events?longPoll`, {
        method: 'post',
        body: JSON.stringify([this.#subscriberId, 10]),
        headers: { cookie: this.#cookie },
      });
    }
    const res = await resp.json();
    const apiResults = res.result.filter(
      (result) => result.topic == TOPIC_METER_UPDATED
    );
    if (!apiResults) {
      return;
    }

    const currentApiResult = apiResults[apiResults.length - 1];
    this.#state.currentUsage =
      currentApiResult.properties.current.find((e) => e.type == 0).power ||
      this.#state.currentUsage;
    this.#state.networkToHouse =
      currentApiResult.properties.current.find((e) => e.type == 1).power ||
      this.#state.networkToHouse;
    this.#state.houseToNetwork =
      currentApiResult.properties.current.find((e) => e.type == 2).power ||
      this.#state.houseToNetwork;
    this.#state.solar =
      currentApiResult.properties.current.find((e) => e.type == 3).power ||
      this.#state.solar;
    this.#state.ownConsumePercentage = currentApiResult.properties.own_consum;
    return this.#state;
  }

  get state() {
    return this.#state;
  }
}
