const Model = require('./Model');

module.exports = class AvailableAssets extends Model {
    constructor (args) {
        super(args);
        this.tableName = 'AvailableAssets';
    }

    create () {
        const params = {
            TableName: this.tableName,
            KeySchema: [
                {
                    AttributeName: 'asset_id',
                    KeyType: 'HASH',
                },
                {
                    AttributeName: 'name',
                    KeyType: 'RANGE',
                },
            ],
            AttributeDefinitions: [
                {
                    AttributeName: 'asset_id',
                    AttributeType: 'S',
                },
                {
                    AttributeName: 'name',
                    AttributeType: 'S',
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10,
            },
        };

        return super.create(params);
    }

    save (assets) {
        return super.save(assets, this.tableName);
    }

    get () {
        const sortAttribute = 'data_trade_count';

        return new Promise((resolve, reject) => {
            super.scan({TableName: this.tableName})
                .then(result => {
                    resolve(super.sortItems(result, sortAttribute));
                })
                .catch(error => {
                    console.warn('Scan AvailableAssets table error', error);
                    reject(error);
                })
        });
    }
};