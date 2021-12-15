/* eslint-disable unicorn/prefer-module */

import type { Contract } from "../types/recordTypes";
import type { DateDiff } from "@cityssm/date-diff/types";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {

  const urlPrefix = exports.urlPrefix as string;

  const canUpdate = exports.canUpdate as boolean;


  /*
   * Exports
   */


  const exportAnchorElements = {
    csv: document.querySelector("#export--csv") as HTMLAnchorElement,
    ical: document.querySelector("#export--ical") as HTMLAnchorElement
  };

  const setExportURL = (exportType: "csv" | "ical") => {

    const exportURLString = window.location.protocol + "//" +
      window.location.host +
      urlPrefix +
      "/export" +
      "/" + exportType +
      "/" + exports.userName +
      "/" + exports.guidA +
      "/" + exports.guidB;

    const exportURL = new URL(exportURLString);

    exportURL.searchParams.set("contractCategory", contractCategoryFilterElement.value);
    exportURL.searchParams.set("searchString", (document.querySelector("#filters--searchString") as HTMLInputElement).value);

    if (includeExpiredFilterElement.checked) {
      exportURL.searchParams.set("includeExpired", includeExpiredFilterElement.value);
    }

    exportAnchorElements[exportType].href = exportURL.href;
  };

  const setExportURLs = () => {
    setExportURL("csv");
    setExportURL("ical");
  };

  const doResetUserAccessGUIDs = () => {

    cityssm.postJSON(urlPrefix + "/contracts/doResetUserAccessGUIDs", {},
      (responseJSON: { success: boolean; guidA: string; guidB: string; }) => {

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
    })
  })


  /*
   * Contract Categories
   */


  const contractCategoryAlias = exports.customizations_contractCategory_alias as string;
  const contractCategoryAliasPlural = exports.customizations_contractCategory_aliasPlural as string;

  let contractCategories: string[] = exports.contractCategories;

  const contractCategoryFilterElement = document.querySelector("#filters--contractCategory") as HTMLSelectElement;


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

    cityssm.postJSON(urlPrefix + "/contracts/doGetContractCategories",
      {},
      (responseJSON: { contractCategories: string[]; }) => {
        contractCategories = responseJSON.contractCategories;
        exports.contractCategories = responseJSON.contractCategories;
        renderContractCategories();
      });
  };


  renderContractCategories();


  /*
   * Contract Search
   */


  const contractAlias = exports.customizations_contract_alias as string;
  const contractAliasPlural = exports.customizations_contract_aliasPlural as string;

  const contractPartyAlias = exports.customizations_contractParty_alias as string;

  const dateDiff = exports.dateDiff as DateDiff;

  const filterFormElement = document.querySelector("#form--filters") as HTMLFormElement;

  const includeExpiredFilterElement = filterFormElement.querySelector("#filters--includeExpired") as HTMLInputElement;

  const searchResultsElement = document.querySelector("#container--results") as HTMLDivElement;


  const getContracts = () => {

    const currentDate = new Date();
    const currentDateString = cityssm.dateToString(currentDate);

    searchResultsElement.innerHTML = "<div class=\"has-text-centered p-4\">" +
      "<span class=\"icon\"><i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i></span>" +
      "</div>";

    cityssm.postJSON(urlPrefix + "/contracts/doGetContracts", filterFormElement,
      (responseJSON: { contracts: Contract[] }) => {

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

    setExportURLs();
  };


  const openContract = (clickEvent: Event) => {
    clickEvent.preventDefault();

    const contractId = (clickEvent.currentTarget as HTMLAnchorElement).dataset.contractId;

    cityssm.openHtmlModal("contractView", {

      onshow: (modalElement) => {

        const contractAliasElements = modalElement.querySelectorAll("[data-customization='contract.alias']");

        for (const contractAliasElement of contractAliasElements) {
          contractAliasElement.textContent = contractAlias;
        }

        const contractCategoryAliasElements = modalElement.querySelectorAll("[data-customization='contractCategory.alias']");

        for (const contractCategoryAliasElement of contractCategoryAliasElements) {
          contractCategoryAliasElement.textContent = contractCategoryAlias;
        }

        const contractPartyAliasElements = modalElement.querySelectorAll("[data-customization='contractParty.alias']");

        for (const contractPartyAliasElement of contractPartyAliasElements) {
          contractPartyAliasElement.textContent = contractPartyAlias;
        }

        if (canUpdate) {
          modalElement.querySelector("#contractEdit--privateContractDescription").closest(".field").classList.remove("is-hidden");
        }
      },

      onshown: (modalElement, closeModalFunction) => {

        bulmaJS.toggleHtmlClipped();

        cityssm.postJSON(urlPrefix + "/contracts/doGetContract", {
          contractId
        }, (responseJSON: { contract: Contract; }) => {

          const contract = responseJSON.contract;

          if (!contract || !contract.contractId) {
            closeModalFunction();
            cityssm.alertModal(contractAlias + " Not Found", "Please try again.", "OK", "danger");
            getContracts();
            return;
          }

          (modalElement.querySelector("#contractEdit--contractId") as HTMLInputElement).value = contract.contractId.toString();
          (modalElement.querySelector("#contractEdit--contractTitle") as HTMLInputElement).value = contract.contractTitle;
          (modalElement.querySelector("#contractEdit--contractCategory") as HTMLInputElement).value = contract.contractCategory;
          (modalElement.querySelector("#contractEdit--contractParty") as HTMLInputElement).value = contract.contractParty;

          const managingUserNameElement = modalElement.querySelector("#contractEdit--managingUserName") as HTMLSelectElement;
          let managingUserNameFound = false;

          if (canUpdate) {
            for (const userName of (exports.canUpdateUserNames as string[])) {

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

          (modalElement.querySelector("#contractEdit--contractDescription") as HTMLInputElement).value = contract.contractDescription;

          if (canUpdate) {
            (modalElement.querySelector("#contractEdit--privateContractDescription") as HTMLInputElement).value = contract.privateContractDescription;
          }

          (modalElement.querySelector("#contractEdit--startDateString") as HTMLInputElement).value = contract.startDateString;
          (modalElement.querySelector("#contractEdit--endDateString") as HTMLInputElement).value = contract.endDateString;
          (modalElement.querySelector("#contractEdit--extensionDateString") as HTMLInputElement).value = contract.extensionDateString;
        });

        if (canUpdate) {
          const editModeButtonElement = modalElement.querySelector("#button--switchToEditMode") as HTMLButtonElement;
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

  getContracts();


  /*
   * Contract Maintenance
   */


  if (!canUpdate) {
    return;
  }

  // UPDATE ONLY

  document.querySelector("#button--addContract").addEventListener("click", () => {

    let addContractCloseModalFunction: () => void;
    let formElement: HTMLFormElement;

    const submitFunction = (formEvent: Event) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/contracts/doAddContract", formElement,
        (responseJSON: { success: boolean }) => {

          if (responseJSON.success) {
            addContractCloseModalFunction();

            if ((formElement.querySelector("#contractAdd--contractCategoryIsNew") as HTMLSelectElement).value === "1") {
              refreshContractCategories();
            }

            getContracts();

          } else {
            cityssm.alertModal("Error Adding " + contractAlias,
              "Please try again",
              "OK",
              "danger");
          }
        });
    };

    cityssm.openHtmlModal("contractAdd", {
      onshow: (modalElement) => {

        const contractAliasElements = modalElement.querySelectorAll("[data-customization='contract.alias']");

        for (const contractAliasElement of contractAliasElements) {
          contractAliasElement.textContent = contractAlias;
        }

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

        const contractPartyAliasElements = modalElement.querySelectorAll("[data-customization='contractParty.alias']");

        for (const contractPartyAliasElement of contractPartyAliasElements) {
          contractPartyAliasElement.textContent = contractPartyAlias;
        }

        const managingUserNameElement = modalElement.querySelector("#contractAdd--managingUserName");

        for (const managingUserName of (exports.canUpdateUserNames as string[])) {

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

        const contractCategoryIsNewElement = modalElement.querySelector("#contractAdd--contractCategoryIsNew") as HTMLSelectElement;
        contractCategoryIsNewElement.addEventListener("change", () => {

          const contractCategoryIsNew = contractCategoryIsNewElement.value === "1";

          if (contractCategoryIsNew) {
            modalElement.querySelector("#field--contractAdd--contractCategory-existing").classList.add("is-hidden");
            modalElement.querySelector("#field--contractAdd--contractCategory-new").classList.remove("is-hidden");
          } else {
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

  const switchContractToEditMode = (closeModalFunction: () => void) => {

    bulmaJS.init();

    // Set up form

    const editFormElement = document.querySelector("#form--contractEdit");
    editFormElement.querySelector("fieldset").disabled = false;

    editFormElement.addEventListener("submit", (formEvent) => {

      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/contracts/doUpdateContract",
        editFormElement,
        (responseJSON: { success: boolean; }) => {

          if (responseJSON.success) {
            closeModalFunction();
            getContracts();
          }
        });
    });

    // Toggle the button visibility
    //
    const modalElement = editFormElement.closest(".modal");
    modalElement.querySelector("#button--switchToEditMode").remove();
    modalElement.querySelector("button[type='submit']").classList.remove("is-hidden");
    modalElement.querySelector("#contractEdit--optionsButton").classList.remove("is-hidden");

    // Set up remove

    const removeContract = () => {
      const contractId = (editFormElement.querySelector("#contractEdit--contractId") as HTMLInputElement).value;

      cityssm.postJSON(urlPrefix + "/contracts/doRemoveContract", {
        contractId
      }, (responseJSON: { success: boolean; }) => {

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
