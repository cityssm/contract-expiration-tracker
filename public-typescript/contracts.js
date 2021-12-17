"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = exports.urlPrefix;
    const canUpdate = exports.canUpdate;
    const contractCategoryFilterElement = document.querySelector("#filters--contractCategory");
    const managingUserNameFilterElement = document.querySelector("#filters--managingUserName");
    const exportAnchorElements = {
        csv: document.querySelector("#export--csv"),
        ical: document.querySelector("#export--ical"),
        "feed/atom": document.querySelector("#export--atom"),
        "feed/rss2": document.querySelector("#export--rss")
    };
    const setExportURL = (exportType) => {
        const exportURLString = window.location.protocol + "//" +
            window.location.host +
            urlPrefix +
            "/export" +
            "/" + exportType +
            "/" + exports.userName +
            "/" + exports.guidA +
            "/" + exports.guidB;
        const exportURL = new URL(exportURLString);
        if (contractCategoryFilterElement.value !== "") {
            exportURL.searchParams.set("contractCategory", contractCategoryFilterElement.value);
        }
        exportURL.searchParams.set("searchString", document.querySelector("#filters--searchString").value);
        if (managingUserNameFilterElement.value !== "") {
            exportURL.searchParams.set("managingUserName", managingUserNameFilterElement.value);
        }
        if (includeExpiredFilterElement.checked) {
            exportURL.searchParams.set("includeExpired", includeExpiredFilterElement.value);
        }
        exportAnchorElements[exportType].href = exportURL.href;
    };
    const setExportURLs = () => {
        setExportURL("csv");
        setExportURL("ical");
        setExportURL("feed/rss2");
        setExportURL("feed/atom");
    };
    const doResetUserAccessGUIDs = () => {
        cityssm.postJSON(urlPrefix + "/contracts/doResetUserAccessGUIDs", {}, (responseJSON) => {
            if (responseJSON.success) {
                bulmaJS.alert({
                    title: "Export Keys Reset Successfully",
                    message: "Note that if your export links are used by any application like Microsoft Excel or Outlook, you will have to update those links."
                });
                exports.guidA = responseJSON.guidA;
                exports.guidB = responseJSON.guidB;
                setExportURLs();
            }
        });
    };
    document.querySelector("#navbar--resetUserAccessGUIDs").addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        bulmaJS.confirm({
            contextualColorName: "warning",
            title: "Are you sure you want to reset your export keys?",
            message: "This should definitely be done if you think your export keys have been compromised.",
            okButton: {
                text: "Yes, Reset the Keys",
                callbackFunction: doResetUserAccessGUIDs
            }
        });
    });
    const contractAlias = exports.customizations_contract_alias;
    const contractAliasPlural = exports.customizations_contract_aliasPlural;
    const contractCategoryAlias = exports.customizations_contractCategory_alias;
    const contractCategoryAliasPlural = exports.customizations_contractCategory_aliasPlural;
    const contractPartyAlias = exports.customizations_contractParty_alias;
    const populateCustomFieldNames = (containerElement) => {
        const contractAliasElements = containerElement.querySelectorAll("[data-customization='contract.alias']");
        for (const contractAliasElement of contractAliasElements) {
            contractAliasElement.textContent = contractAlias;
        }
        const contractCategoryAliasElements = containerElement.querySelectorAll("[data-customization='contractCategory.alias']");
        for (const contractCategoryAliasElement of contractCategoryAliasElements) {
            contractCategoryAliasElement.textContent = contractCategoryAlias;
        }
        const contractPartyAliasElements = containerElement.querySelectorAll("[data-customization='contractParty.alias']");
        for (const contractPartyAliasElement of contractPartyAliasElements) {
            contractPartyAliasElement.textContent = contractPartyAlias;
        }
    };
    let contractCategories = exports.contractCategories;
    const renderContractCategories = () => {
        const currentContractCategory = contractCategoryFilterElement.value;
        let currentContractCategoryFound = false;
        contractCategoryFilterElement.innerHTML = "<option value=\"\">(All Available " + cityssm.escapeHTML(contractCategoryAliasPlural) + ")</option>";
        for (const contractCategory of contractCategories) {
            const optionElement = document.createElement("option");
            optionElement.value = contractCategory;
            optionElement.textContent = contractCategory;
            contractCategoryFilterElement.append(optionElement);
            if (currentContractCategory === contractCategory) {
                optionElement.selected = true;
                currentContractCategoryFound = true;
            }
        }
        if (currentContractCategory !== "" && !currentContractCategoryFound) {
            getContracts();
        }
    };
    const refreshContractCategories = () => {
        cityssm.postJSON(urlPrefix + "/contracts/doGetContractCategories", {}, (responseJSON) => {
            contractCategories = responseJSON.contractCategories;
            exports.contractCategories = responseJSON.contractCategories;
            renderContractCategories();
        });
    };
    renderContractCategories();
    const dateDiff = exports.dateDiff;
    const filterFormElement = document.querySelector("#form--filters");
    const includeExpiredFilterElement = filterFormElement.querySelector("#filters--includeExpired");
    const searchResultsElement = document.querySelector("#container--results");
    const getContracts = () => {
        const currentDate = new Date();
        const currentDateString = cityssm.dateToString(currentDate);
        searchResultsElement.innerHTML = "<div class=\"has-text-centered p-4\">" +
            "<span class=\"icon\"><i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i></span>" +
            "</div>";
        cityssm.postJSON(urlPrefix + "/contracts/doGetContracts", filterFormElement, (responseJSON) => {
            if (responseJSON.contracts.length === 0) {
                searchResultsElement.innerHTML = "<div class=\"message is-info\">" +
                    "<p class=\"message-body\">There are no " + contractAliasPlural.toLowerCase() + " available.</p>" +
                    "</div>";
                return;
            }
            const panelElement = document.createElement("div");
            panelElement.className = "panel";
            for (const contract of responseJSON.contracts) {
                const panelBlockElement = document.createElement("a");
                panelBlockElement.className = "panel-block is-block";
                if (contract.endDate && contract.endDateString < currentDateString) {
                    panelBlockElement.classList.add("has-background-danger-light");
                }
                panelBlockElement.dataset.contractId = contract.contractId.toString();
                panelBlockElement.href = "#";
                panelBlockElement.addEventListener("click", openContract);
                panelBlockElement.innerHTML = "<div class=\"columns is-multiline is-mobile\">" +
                    ("<div class=\"column is-12-mobile is-8-tablet\">" +
                        "<h2 class=\"title is-5 mb-1\">" + cityssm.escapeHTML(contract.contractTitle) + "</h2>" +
                        "<div class=\"columns is-mobile\">" +
                        ("<div class=\"column\">" +
                            (contract.contractCategory !== ""
                                ? "<span class=\"icon\"><i class=\"fas fa-archive\" aria-hidden=\"true\"></i></span> " + cityssm.escapeHTML(contract.contractCategory) + "<br />"
                                : "") +
                            (contract.contractParty !== ""
                                ? "<span class=\"icon\"><i class=\"fas fa-user-tie\" aria-hidden=\"true\"></i></span> " + cityssm.escapeHTML(contract.contractParty) + "<br />"
                                : "") +
                            "</div>") +
                        (contract.managingUserName && contract.managingUserName !== ""
                            ? "<div class=\"column is-4\">" +
                                "<span class=\"icon\"><i class=\"fas fa-id-card\" aria-hidden=\"true\"></i></span> " + cityssm.escapeHTML(contract.managingUserName) +
                                "</div>"
                            : "") +
                        "</div>" +
                        "</div>") +
                    ("<div class=\"column is-6-mobile has-text-centered\">" +
                        "<i class=\"fas fa-play" + (contract.startDateString <= currentDateString ? " has-text-success" : "") + "\" aria-hidden=\"true\"></i><br />" +
                        contract.startDateString +
                        (contract.startDateString <= currentDateString
                            ? "<br /><span class=\"is-size-7\">" + dateDiff(cityssm.dateStringToDate(contract.startDateString), currentDate).formatted + " ago" :
                            "") +
                        "</div>") +
                    ("<div class=\"column is-6-mobile has-text-centered\">" +
                        "<i class=\"fas fa-stop\" aria-hidden=\"true\"></i><br />" +
                        (contract.endDate
                            ? contract.endDateString
                            : "<span class=\"has-text-grey\">No End Date</span>") +
                        (contract.extensionDate
                            ? "<br /><span class=\"is-size-7\">Extend to " + contract.extensionDateString + "</span>"
                            : "") +
                        "</div>") +
                    "</div>";
                panelElement.append(panelBlockElement);
            }
            searchResultsElement.innerHTML = "";
            searchResultsElement.append(panelElement);
        });
        setExportURLs();
    };
    const openContract = (clickEvent) => {
        clickEvent.preventDefault();
        const contractId = clickEvent.currentTarget.dataset.contractId;
        cityssm.openHtmlModal("contractView", {
            onshow: (modalElement) => {
                populateCustomFieldNames(modalElement);
                if (canUpdate) {
                    modalElement.querySelector("#contractEdit--privateContractDescription").closest(".field").classList.remove("is-hidden");
                }
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                cityssm.postJSON(urlPrefix + "/contracts/doGetContract", {
                    contractId
                }, (responseJSON) => {
                    const contract = responseJSON.contract;
                    if (!contract || !contract.contractId) {
                        closeModalFunction();
                        cityssm.alertModal(contractAlias + " Not Found", "Please try again.", "OK", "danger");
                        getContracts();
                        return;
                    }
                    modalElement.querySelector("#contractEdit--contractId").value = contract.contractId.toString();
                    modalElement.querySelector("#contractEdit--contractTitle").value = contract.contractTitle;
                    modalElement.querySelector("#contractEdit--contractCategory").value = contract.contractCategory;
                    modalElement.querySelector("#contractEdit--contractParty").value = contract.contractParty;
                    const managingUserNameElement = modalElement.querySelector("#contractEdit--managingUserName");
                    let managingUserNameFound = false;
                    if (canUpdate) {
                        for (const userName of exports.canUpdateUserNames) {
                            const optionElement = document.createElement("option");
                            optionElement.textContent = userName;
                            optionElement.value = userName;
                            managingUserNameElement.append(optionElement);
                            if (contract.managingUserName && contract.managingUserName === userName) {
                                optionElement.selected = true;
                                managingUserNameFound = true;
                            }
                        }
                    }
                    if (contract.managingUserName && contract.managingUserName !== "" && !managingUserNameFound) {
                        const optionElement = document.createElement("option");
                        optionElement.textContent = contract.managingUserName;
                        optionElement.value = contract.managingUserName;
                        managingUserNameElement.append(optionElement);
                        optionElement.selected = true;
                    }
                    modalElement.querySelector("#contractEdit--contractDescription").value = contract.contractDescription;
                    if (canUpdate) {
                        modalElement.querySelector("#contractEdit--privateContractDescription").value = contract.privateContractDescription;
                    }
                    modalElement.querySelector("#contractEdit--startDateString").value = contract.startDateString;
                    modalElement.querySelector("#contractEdit--endDateString").value = contract.endDateString;
                    modalElement.querySelector("#contractEdit--extensionDateString").value = contract.extensionDateString;
                });
                if (canUpdate) {
                    const editModeButtonElement = modalElement.querySelector("#button--switchToEditMode");
                    editModeButtonElement.classList.remove("is-hidden");
                    editModeButtonElement.addEventListener("click", () => {
                        switchContractToEditMode(closeModalFunction);
                    });
                }
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };
    filterFormElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
    });
    contractCategoryFilterElement.addEventListener("change", getContracts);
    document.querySelector("#filters--searchString").addEventListener("change", getContracts);
    includeExpiredFilterElement.addEventListener("change", getContracts);
    managingUserNameFilterElement.addEventListener("change", getContracts);
    getContracts();
    if (!canUpdate) {
        return;
    }
    document.querySelector("#button--addContract").addEventListener("click", () => {
        let addContractCloseModalFunction;
        let formElement;
        const submitFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/contracts/doAddContract", formElement, (responseJSON) => {
                if (responseJSON.success) {
                    addContractCloseModalFunction();
                    if (formElement.querySelector("#contractAdd--contractCategoryIsNew").value === "1") {
                        refreshContractCategories();
                    }
                    getContracts();
                }
                else {
                    cityssm.alertModal("Error Adding " + contractAlias, "Please try again", "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("contractAdd", {
            onshow: (modalElement) => {
                populateCustomFieldNames(modalElement);
                const existingContactCategoryElement = modalElement.querySelector("#contractAdd--contactCategory-existing");
                for (const contractCategory of contractCategories) {
                    const optionElement = document.createElement("option");
                    optionElement.textContent = contractCategory;
                    optionElement.value = contractCategory;
                    existingContactCategoryElement.append(optionElement);
                }
                const managingUserNameElement = modalElement.querySelector("#contractAdd--managingUserName");
                for (const managingUserName of exports.canUpdateUserNames) {
                    const optionElement = document.createElement("option");
                    optionElement.textContent = managingUserName;
                    optionElement.value = managingUserName;
                    managingUserNameElement.append(optionElement);
                    if (managingUserName === exports.userName) {
                        optionElement.selected = true;
                    }
                }
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                addContractCloseModalFunction = closeModalFunction;
                formElement = modalElement.querySelector("form");
                formElement.addEventListener("submit", submitFunction);
                const contractCategoryIsNewElement = modalElement.querySelector("#contractAdd--contractCategoryIsNew");
                contractCategoryIsNewElement.addEventListener("change", () => {
                    const contractCategoryIsNew = contractCategoryIsNewElement.value === "1";
                    if (contractCategoryIsNew) {
                        modalElement.querySelector("#field--contractAdd--contractCategory-existing").classList.add("is-hidden");
                        modalElement.querySelector("#field--contractAdd--contractCategory-new").classList.remove("is-hidden");
                    }
                    else {
                        modalElement.querySelector("#field--contractAdd--contractCategory-new").classList.add("is-hidden");
                        modalElement.querySelector("#field--contractAdd--contractCategory-existing").classList.remove("is-hidden");
                    }
                });
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    const switchContractToEditMode = (closeModalFunction) => {
        bulmaJS.init();
        const editFormElement = document.querySelector("#form--contractEdit");
        editFormElement.querySelector("fieldset").disabled = false;
        editFormElement.addEventListener("submit", (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/contracts/doUpdateContract", editFormElement, (responseJSON) => {
                if (responseJSON.success) {
                    closeModalFunction();
                    getContracts();
                }
            });
        });
        const modalElement = editFormElement.closest(".modal");
        modalElement.querySelector("#button--switchToEditMode").remove();
        modalElement.querySelector("button[type='submit']").classList.remove("is-hidden");
        modalElement.querySelector("#contractEdit--optionsButton").classList.remove("is-hidden");
        const removeContract = () => {
            const contractId = editFormElement.querySelector("#contractEdit--contractId").value;
            cityssm.postJSON(urlPrefix + "/contracts/doRemoveContract", {
                contractId
            }, (responseJSON) => {
                if (responseJSON.success) {
                    closeModalFunction();
                    refreshContractCategories();
                    getContracts();
                }
            });
        };
        modalElement.querySelector("#contractEdit--removeContractButton").addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                message: "Are you sure you want to remove this contract record?",
                okButton: {
                    text: "Yes, Remove the Contract",
                    callbackFunction: removeContract
                }
            });
        });
    };
})();
