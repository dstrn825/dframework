/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

class MongoAPI {
    constructor() {
        const { MongoClient } = require("mongodb");
        const bcrypt = require("bcrypt");
        this.MongoClient = MongoClient;
        this.bcrypt = bcrypt;

        this.devMode = true;

        this.config = {
            maxPoolSize: 1,
            maxIdleTimeMS: 2000,
        };

        this.currentClient = this.devMode ? "dev" : "prod";

        this.servers = {
            dev: "", // mongo server URL
            prod: "", // mongo server URL
        };

        this.clients = {
            dev: new MongoClient(this.servers.dev, this.config),
            prod: new MongoClient(this.servers.prod, this.config),
        };

        this.dbs = {
            dev: null,
            prod: null,
        }

        this.dbName = "";
    }

    async connect(client, single=true) {
        if(!client) { client = "dev" };
        if(!Object.keys(this.clients).includes(client)) { throw new Error("This client doesn't exist") };
        this.currentClient = client;
        this.single = single;
        if(single){
            this.clients[client] = await this.clients[client]?.connect();
            this.dbs[client] = this.clients[client].db(this.dbName);
        } else {
            const connectPromises = Object.keys(this.clients).map(async (key) => {
                this.clients[key] = await this.clients[key]?.connect();
                this.dbs[key] = this.clients[key].db(this.dbName);
                return this.clients[key];
            });
            await Promise.all(connectPromises);
        }
    }
    async find(collection, query, options = {}) {
        const db = this.dbs[this.currentClient];
        if (!db) return null;
        return await db.collection(collection).find(query, options).toArray();
    }
    async findOne(collection, query, options = {}) {
        const db = this.dbs[this.currentClient];
        if (!db) return null;
        return await db.collection(collection).findOne(query, options);
    }
    async insertOne(collection, document) {
        const db = this.dbs[this.currentClient];
        if (!db) return null;
        return await db.collection(collection).insertOne(document);
    }
    async insertMany(collection, documents) {
        const db = this.dbs[this.currentClient];
        if (!db) return null;
        return await db.collection(collection).insertMany(documents);
    }
    async updateOne(collection, filter, update, options = {}) {
        const db = this.dbs[this.currentClient];
        if (!db) return null;
        return await db.collection(collection).updateOne(filter, update, options);
    }
    async updateMany(collection, filter, update, options = {}) {
        const db = this.dbs[this.currentClient];
        if (!db) return null;
        return await db.collection(collection).updateMany(filter, update, options);
    }
    async deleteOne(collection, filter, options = {}) {
        const db = this.dbs[this.currentClient];
        if (!db) return null;
        return await db.collection(collection).deleteOne(filter, options);
    }
    async deleteMany(collection, filter, options = {}) {
        const db = this.dbs[this.currentClient];
        if (!db) return null;
        return await db.collection(collection).deleteMany(filter, options);
    }

    async destroy(){
        await Promise.all(Object.keys(this.clients).map(async (key) => {
            this.clients[key]?.close();
        }));
    }
    createClient(server){
        if(this.servers[server] == "") return null;
        const client = new this.MongoClient(this.servers[server], this.config);
        return client;
    }
    async ping(){
        const devClient = this.createClient("dev");
        const prodClient = this.createClient("prod");

        async function pingClient(client){
            if(!client) return 0;
            const start = Date.now();
            const instance = await client.connect();
            const db = instance.db(this.dbName);
            await db.command({ ping: 1 });
            await instance.close();
            return Date.now() - start;
        }

        const devPing = pingClient(devClient);
        const prodPing = pingClient(prodClient);
        return { dev: devPing, prod: prodPing };
    }
}

module.exports = { MongoAPI };