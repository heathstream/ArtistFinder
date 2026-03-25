'use strict'

export function musicGroupService(url) {

    this.url = url;

    // Generiska CRUD-metoder:
    this._myFetch = async function (url, method = null, body = null) {
        try {

            method ??= 'GET';
            let res = await fetch(url, {
                method: method,
                headers: { 'content-type': 'application/json' },
                body: body ? JSON.stringify(body) : null
            });

            if (res.ok) {
                console.log(`\n${method} Request successful @ ${url}`);
                //get the data from server
                let json = await res.json();
                return json;
            }
            else {
                //typcially you would log an error instead
                console.log(`Failed to receive data from server: ${res.status}`);
                alert(`Failed to receive data from server: ${res.status}`);
            }
        }
        catch (error) {
            console.log(`Failed to receive data from server: ${error.message}`);
            alert(`Failed to receive data from server: ${error.message}`);
        }
    }

    this._readItemsAsync = async function (reqUrl, pageNr, flat, filter, pageSize) {
        reqUrl += `?flat=${flat}&pageNr=${pageNr}&pageSize=${pageSize}`;
        if (filter != null) {
            reqUrl += `&filter=${filter}`
        }
        let json = await this._myFetch(reqUrl);
        return json;
    }

    this._readItemAsync = async function (reqUrl, id, flat) {
        reqUrl += `?flat=${flat}&id=${id}`;
        let json = await this._myFetch(reqUrl);
        return json;
    }
    
    this._createItemAsync = async function (reqUrl, newItem) {
        let json = await this._myFetch(reqUrl, 'POST', newItem);
        return json;
    }
    
    // this._readItemDtoAsync = async function (reqUrl, id, flat) {
    //     reqUrl += `?id=${id}`;
    //     let data = await this._myFetch(reqUrl);
    //     return data;
    // }

    // this._updateItemAsync = async function (reqUrl, id, newItem) {
    //     reqUrl += `/${id}`;
    //     let data = await this._myFetch(reqUrl, 'PUT', newItem);
    //     return data;
    // }

    // this._deleteItemAsync = async function (reqUrl, id) {
    //     reqUrl += `/${id}`;
    //     let data = await this._myFetch(reqUrl, 'DELETE');
    //     return data;
    // }

    //#endregion
    
    // CRUD-metoder för musikgrupper:
    this.readMusicGroupsAsync = async (pageNr, pageSize, filter = null) => await this._readItemsAsync(`${this.url}/MusicGroups/Read`, pageNr, true, filter, pageSize);
    this.readMusicGroupAsync = async (musicGroupId) => await this._readItemAsync(`${this.url}/MusicGroups/ReadItem`, musicGroupId, false);
    this.createMusicGroupAsync = async (newItem) => await this._createItemAsync(`${this.url}/MusicGroups/CreateItem`, newItem);

    // CRUD-metoder för artister:
    this.readArtistAsync = async (artistId) => await this._readItemsAsync(`${this.url}/Artists/ReadItem`, artistId, false);
    
    // this.readInfoAsync = async () => await this._myFetch(`${this.url}/Guest/Info`);
    // this.readFriendDtoAsync = async (friendId) => await this._readItemDtoAsync(`${this.url}/Friends/ReadItemDto`, friendId, false);
    // this.updateFriendAsync = async (friendId, newItem) => await this._updateItemAsync(`${this.url}/Friends/UpdateItem`, friendId, newItem);
    // this.deleteFriendAsync = async (friendId) => await this._deleteItemAsync(`${this.url}/Friends/DeleteItem`, friendId);

    
}