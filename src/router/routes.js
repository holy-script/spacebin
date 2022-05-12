const routes = [{
        path: "/",
        component: () =>
            import ("layouts/MainLayout.vue"),
        children: [{
                name: "Home",
                path: "",
                component: () =>
                    import ("pages/IndexPage.vue"),
            },
            {
                name: "Editor",
                path: "editor",
                component: () =>
                    import ("pages/EditorPage.vue"),
            },
            {
                name: "Viewer",
                path: "viewer/:uid",
                component: () =>
                    import ("pages/ViewerPage.vue"),
            },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        component: () =>
            import ("pages/ErrorNotFound.vue"),
    },
];

export default routes;
