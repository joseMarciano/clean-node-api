import { Collection, Document, MongoClient } from 'mongodb';
import { AccountModel } from '../../../../domain/model/Account';

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect (uri: string): Promise<void> {
    this.url = uri;
    this.client = await MongoClient.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
  },

  async disconnect (): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.url);
    return this.client.db().collection(name);
  },

  map (document: Document): AccountModel {
    if (!document) return null;

    const { _id, ...obj } = document as any;
    return {
      id: _id,
      ...obj
    }
  }

}
