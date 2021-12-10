"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const contractCategoryUsersMaintButton = document.querySelector("#navbar--contractCategoryUsersMaint");
    if (!contractCategoryUsersMaintButton) {
        return;
    }
    const urlPrefix = exports.urlPrefix;
    const contractCategoryAlias = exports.customizations_contractCategory_alias;
    let contractCategoryUsersMaintModalElement;
    let contractCategoryFilterElement;
    let userNameAddElement;
    let userNameAddDatalistElement;
    let userNameFilterElement;
    let contractCategoryAddElement;
    let contractCategoryUsersResultsElement;
    const getActiveFilterTabName = () => {
        if (contractCategoryUsersMaintModalElement.querySelector("#ccuFilterTab--userName").classList.contains("is-hidden")) {
            return "contractCategory";
        }
        return "userName";
    };
    const removeContractCategoryUser = (clickEvent) => {
        clickEvent.preventDefault();
        const panelBlockElement = clickEvent.currentTarget.closest(".panel-block");
        const userName = panelBlockElement.dataset.userName;
        const contractCategory = panelBlockElement.dataset.contractCategory;
        const doRemove = () => {
            cityssm.postJSON(urlPrefix + "/admin/doRemoveContractCategoryUser", {
                userName,
                contractCategory
            }, (responseJSON) => {
                if (responseJSON.success) {
                    panelBlockElement.remove();
                }
            });
        };
        bulmaJS.confirm({
            message: "Are you sure you want to remove this permission?",
            okButton: {
                text: "Yes, Remove Permission",
                callbackFunction: doRemove
            }
        });
    };
    const refreshContractCategoryUsers = () => {
        contractCategoryUsersResultsElement.innerHTML = "<div class=\"has-text-centered\">" +
            "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
            "<em>Loading...</em>" +
            "</div>";
        contractCategoryAddElement.value = "";
        const activeFilterTabName = getActiveFilterTabName();
        const postParameters = (activeFilterTabName === "contractCategory"
            ? { contractCategory: contractCategoryFilterElement.value }
            : { userName: userNameFilterElement.value });
        cityssm.postJSON(urlPrefix + "/admin/doGetContractCategoryUsers", postParameters, (responseJSON) => {
            if (responseJSON.contractCategoryUsers.length === 0) {
                contractCategoryUsersResultsElement.innerHTML = "<div class=\"message is-info\">" +
                    "<p class=\"message-body\">No permissions found.</p>" +
                    "</div>";
                return;
            }
            const panelElement = document.createElement("div");
            panelElement.className = "panel";
            for (const contractCategoryUser of responseJSON.contractCategoryUsers) {
                const panelBlockElement = document.createElement("div");
                panelBlockElement.className = "panel-block";
                panelBlockElement.dataset.userName = contractCategoryUser.userName;
                panelBlockElement.dataset.contractCategory = contractCategoryUser.contractCategory;
                panelBlockElement.innerHTML = "<button class=\"button is-danger is-light has-tooltip-right has-tooltip-arrow mr-2\" data-tooltip=\"Remove Permission\" type=\"button\">" +
                    "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>" +
                    "<span class=\"is-sr-only\">Remove Permission</span>" +
                    "</button>";
                panelBlockElement.querySelector("button").addEventListener("click", removeContractCategoryUser);
                panelBlockElement.insertAdjacentText("beforeend", activeFilterTabName === "contractCategory"
                    ? contractCategoryUser.userName
                    : contractCategoryUser.contractCategory);
                panelElement.append(panelBlockElement);
            }
            contractCategoryUsersResultsElement.innerHTML = "";
            contractCategoryUsersResultsElement.append(panelElement);
        });
    };
    let userNames = [];
    let contractCategories = [];
    const renderContractCategories = () => {
        const currentContractCategory = contractCategoryFilterElement.value;
        contractCategoryFilterElement.innerHTML = "";
        contractCategoryAddElement.innerHTML = "<option value=\"\">(Select)</option>";
        for (const contractCategory of contractCategories) {
            const optionElement = document.createElement("option");
            optionElement.value = contractCategory;
            optionElement.textContent = contractCategory;
            contractCategoryFilterElement.append(optionElement);
            contractCategoryAddElement.append(optionElement.cloneNode(true));
            if (contractCategory === currentContractCategory) {
                optionElement.selected = true;
            }
        }
    };
    const refreshContractCategories = () => {
        contractCategories = exports.contractCategories;
        renderContractCategories();
    };
    const addContractCategoryUser = (clickEvent) => {
        clickEvent.preventDefault();
        const filterTabElement = clickEvent.currentTarget.closest(".ccuFilterTab");
        const userName = filterTabElement.querySelector("[name='userName']").value;
        if (userName === "") {
            bulmaJS.alert("A user name is required.");
            return;
        }
        const contractCategory = filterTabElement.querySelector("[name='contractCategory']").value;
        if (contractCategory === "") {
            bulmaJS.alert("A " + contractCategoryAlias + " is required.");
            return;
        }
        const panelBlockElements = contractCategoryUsersResultsElement
            .querySelectorAll(".panel-block");
        for (const panelBlockElement of panelBlockElements) {
            if (panelBlockElement.dataset.userName === userName && panelBlockElement.dataset.contractCategory === contractCategory) {
                bulmaJS.alert("Permission already assigned.");
                return;
            }
        }
        cityssm.postJSON(urlPrefix + "/admin/doAddContractCategoryUser", {
            userName,
            contractCategory
        }, (responseJSON) => {
            if (responseJSON.success) {
                if (getActiveFilterTabName() === "contractCategory") {
                    refreshUserNames();
                }
                else {
                    refreshContractCategoryUsers();
                }
            }
        });
    };
    const renderUserNames = () => {
        const currentUserName = userNameFilterElement.value;
        userNameFilterElement.innerHTML = "";
        userNameAddElement.value = "";
        userNameAddDatalistElement.innerHTML = "";
        for (const userName of userNames) {
            const optionElement = document.createElement("option");
            optionElement.value = userName;
            optionElement.textContent = userName;
            userNameFilterElement.append(optionElement);
            userNameAddDatalistElement.append(optionElement.cloneNode());
            if (userName === currentUserName) {
                optionElement.selected = true;
            }
        }
        refreshContractCategoryUsers();
    };
    const refreshUserNames = () => {
        cityssm.postJSON(urlPrefix + "/admin/doGetUserNames", {}, (responseJSON) => {
            userNames = responseJSON.userNames;
            renderUserNames();
        });
    };
    const openContractCategoryUsersMaintModal = () => {
        cityssm.openHtmlModal("contractCategoryUsersMaint", {
            onshow: (modalElement) => {
                contractCategoryUsersMaintModalElement = modalElement;
                userNameFilterElement = modalElement.querySelector("#ccuFilter--userName");
                contractCategoryAddElement = modalElement.querySelector("#ccuAdd--contractCategory");
                contractCategoryFilterElement = modalElement.querySelector("#ccuFilter--contractCategory");
                userNameAddElement = modalElement.querySelector("#ccuAdd--userName");
                userNameAddDatalistElement = modalElement.querySelector("#ccuAdd--userName-datalist");
                contractCategoryUsersResultsElement = modalElement.querySelector("#ccu--results");
                const contractCategoryAliasElements = modalElement.querySelectorAll("[data-customization='contractCategory.alias']");
                for (const contractCategoryAliasElement of contractCategoryAliasElements) {
                    contractCategoryAliasElement.textContent = contractCategoryAlias;
                }
                bulmaJS.init(modalElement);
                const tabAnchorElements = modalElement.querySelectorAll(".tabs a");
                for (const tabAnchorElement of tabAnchorElements) {
                    tabAnchorElement.addEventListener("click", refreshContractCategoryUsers);
                }
                refreshUserNames();
                refreshContractCategories();
            },
            onshown: (modalElement) => {
                bulmaJS.toggleHtmlClipped();
                userNameFilterElement.addEventListener("change", refreshContractCategoryUsers);
                contractCategoryFilterElement.addEventListener("change", refreshContractCategoryUsers);
                const addContractCategoryUserButtonElements = modalElement.querySelectorAll(".ccuAddButton");
                for (const addContractCategoryUserButtonElement of addContractCategoryUserButtonElements) {
                    addContractCategoryUserButtonElement.addEventListener("click", addContractCategoryUser);
                }
            },
            onhidden: () => {
                contractCategoryUsersMaintModalElement = undefined;
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };
    contractCategoryUsersMaintButton.addEventListener("click", openContractCategoryUsersMaintModal);
})();
