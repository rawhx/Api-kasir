const express = require("express");
const Helper = require("../../Helpers/helper");

const Menu = express.Router();

Menu.get('/', (req, res) => {
    try {
        Helper.Response(res, {
            data: [
                {
                    menu_id: 1,
                    menu_nama: 'Dashboard',
                    menu_parent: null,
                    menu_visible: false,
                    child: []
                },
                {
                    menu_id: 2,
                    menu_nama: 'Master',
                    menu_parent: null,
                    menu_visible: false,
                    child: [
                        {
                            menu_id: 2.1,
                            menu_nama: 'Barang',
                            menu_parent: 2,
                            menu_visible: false,
                            child: []
                        },
                        {
                            menu_id: 2.2,
                            menu_nama: 'Stok',
                            menu_parent: 2,
                            menu_visible: false,
                            child: []
                        }
                    ]
                },
                {
                    menu_id: 3,
                    menu_nama: 'Penjualan',
                    menu_parent: null,
                    menu_visible: false,
                    child: [
                        {
                            menu_id: 3.1,
                            menu_nama: 'Kasir',
                            menu_parent: null,
                            menu_visible: false,
                            child: []
                        },
                        {
                            menu_id: 3.2,
                            menu_nama: 'Pendapatan',
                            menu_parent: null,
                            menu_visible: false,
                            child: []
                        },
                    ]
                },
            ]
        })
    } catch (error) {
        Helper.ResponseError({
            errorMessage: error 
        })
    }
})

module.exports = Menu
