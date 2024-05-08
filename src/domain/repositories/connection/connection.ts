import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Usuario } from '../../entities/usuario';

type typeList = string | number | undefined;

export class Connection {
    constructor(){
    }

    static async connection(){
        const db = await open({
            filename: './database.db',
            driver: sqlite3.cached.Database
        });
        return db
    }

    async executeGet(sql: string, bind: typeList[]){
        const db = await Connection.connection();
        const query = await db.get(sql, bind);
        return query;
    }
    async executeRun(sql: string, bind: typeList[]){
        const db = await Connection.connection();
        const query = await db.run(sql, bind);
        return query;
    }
    async executeAll(sql: string, bind: typeList[]){
        const db = await Connection.connection();
        const query = await db.all(sql, bind);
        return query;
    }
}