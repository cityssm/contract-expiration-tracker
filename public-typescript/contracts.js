"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = exports.urlPrefix;
    const contractCategoryAlias = exports.customizations_contractCategory_alias;
    const contractCategoryAliasPlural = exports.customizations_contractCategory_aliasPlural;
    let contractCategories = exports.contractCategories;
    const contractCategoryFilterElement = document.querySelector("#filters--contractCategory");
    const renderContractCategories = () => {
        const currentContractCategory = contractCategoryFilterElement.value;
        contractCategoryFilterElement.innerHTML = "<option value=\"\">(All Available " + cityssm.escapeHTML(contractCategoryAliasPlural) + ")</option>";
        for (const contractCategory of contractCategories) {
            const optionElement = document.createElement("option");
            optionElement.value = contractCategory;
            optionElement.textContent = contractCategory;
            contractCategoryFilterElement.append(optionElement);
            if (currentContractCategory === contractCategory) {
                optionElement.selected = true;
            }
        }
    };
    const refreshContractCategories = () => {
        cityssm.postJSON(urlPrefix + "/contracts/doGetContractCategories", {}, (responseJSON) => {
            contractCategories = responseJSON.contractCategories;
            renderContractCategories();
        });
    };
    renderContractCategories();
    const dateDiff = exports.dateDiff;
    const filterFormElement = document.querySelector("#form--filters");
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
                    "<p class=\"message-body\">There are no contracts available.</p>" +
                    "</div>";
                return;
            }
            const panelElement = document.createElement("div");
            panelElement.className = "panel";
            for (const contract of responseJSON.contracts) {
                const panelBlockElement = document.createElement("a");
                panelBlockElement.className = "panel-block is-block";
                panelBlockElement.dataset.contractId = contract.contractId.toString();
                panelBlockElement.href = "#";
                panelBlockElement.addEventListener("click", openContract);
                panelBlockElement.innerHTML = "<div class=\"columns is-multiline is-mobile\">" +
                    ("<div class=\"column is-12-mobile is-8-tablet\">" +
                        "<h2 class=\"title is-5 mb-1\">" + cityssm.escapeHTML(contract.contractTitle) + "</h2>" +
                        (contract.contractCategory !== ""
                            ? "<span class=\"icon\"><i class=\"fas fa-archive\" aria-hidden=\"true\"></i></span> " + cityssm.escapeHTML(contract.contractCategory) + "<br />"
                            : "") +
                        (contract.contractParty !== ""
                            ? "<span class=\"icon\"><i class=\"fas fa-user-tie\" aria-hidden=\"true\"></i></span> " + cityssm.escapeHTML(contract.contractParty) + "<br />"
                            : "") +
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
    };
    const openContract = (clickEvent) => {
        clickEvent.preventDefault();
        const contractId = clickEvent.currentTarget.dataset.contractId;
        cityssm.openHtmlModal("contractView", {
            onshow: (modalElement) => {
                const contractCategoryAliasElements = modalElement.querySelectorAll("[data-customization='contractCategory.alias']");
                for (const contractCategoryAliasElement of contractCategoryAliasElements) {
                    contractCategoryAliasElement.textContent = contractCategoryAlias;
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
                        cityssm.alertModal("Contract Not Found", "Please try again.", "OK", "danger");
                        getContracts();
                        return;
                    }
                    modalElement.querySelector("#contractEdit--contractId").value = contract.contractId.toString();
                    modalElement.querySelector("#contractEdit--contractTitle").value = contract.contractTitle;
                    modalElement.querySelector("#contractEdit--contractCategory").value = contract.contractCategory;
                    modalElement.querySelector("#contractEdit--contractParty").value = contract.contractParty;
                    modalElement.querySelector("#contractEdit--contractDescription").value = contract.contractDescription;
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
    document.querySelector("#filters--includeExpired").addEventListener("change", getContracts);
    getContracts();
    const canUpdate = exports.canUpdate;
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
                    cityssm.alertModal("Error Adding Contract", "Please try again", "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("contractAdd", {
            onshow: (modalElement) => {
                const contractCategoryAliasElements = modalElement.querySelectorAll("[data-customization='contractCategory.alias']");
                for (const contractCategoryAliasElement of contractCategoryAliasElements) {
                    contractCategoryAliasElement.textContent = contractCategoryAlias;
                }
                const existingContactCategoryElement = modalElement.querySelector("#contractAdd--contactCategory-existing");
                for (const contractCategory of contractCategories) {
                    const optionElement = document.createElement("option");
                    optionElement.textContent = contractCategory;
                    optionElement.value = contractCategory;
                    existingContactCategoryElement.append(optionElement);
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
