/* eslint-disable unicorn/prefer-module */

import type { Contract } from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;

(() => {

  /*
   * Contract Search
   */

  const urlPrefix = exports.urlPrefix as string;

  const filterFormElement = document.querySelector("#form--filters") as HTMLFormElement;
  const searchResultsElement = document.querySelector("#container--results") as HTMLDivElement;

  const getContracts = () => {

    searchResultsElement.innerHTML = "<div class=\"has-text-centered p-4\">" +
      "<span class=\"icon\"><i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i></span>" +
      "</div>";

    cityssm.postJSON(urlPrefix + "/contracts/doGetContracts", filterFormElement,
      (responseJSON: { contracts: Contract[] }) => {

        if (responseJSON.contracts.length === 0) {
          searchResultsElement.innerHTML = "<div class=\"message is-info\">" +
            "<p class=\"message-body\">There are no contracts available.</p>" +
            "</div>";
          return;
        }
      });
  };

  filterFormElement.addEventListener("submit", (formEvent) => {
    formEvent.preventDefault();
  });

  document.querySelector("#filters--searchString").addEventListener("change", getContracts);
  document.querySelector("#filters--includeExpired").addEventListener("change", getContracts);

  getContracts();

  /*
   * Contract Maintenance
   */

  const canUpdate = exports.canUpdate as boolean;

  if (!canUpdate) {
    return;
  }

  // UPDATE ONLY

  document.querySelector("#button--addContract").addEventListener("click", () => {

    let addContractCloseModalFunction: () => void;

    const submitFunction = (formEvent: Event) => {
      formEvent.preventDefault();
    };

    cityssm.openHtmlModal("contractAdd", {
      onshow: (modalElement) => {

        const contractCategoryAlias = exports.customizations_contractCategory_alias as string;

        const contractCategoryAliasElements = modalElement.querySelectorAll("[data-customization='contractCategory.alias']");

        for (const contractCategoryAliasElement of contractCategoryAliasElements) {
          contractCategoryAliasElement.textContent = contractCategoryAlias;
        }
      },
      onshown: (modalElement, closeModalFunction) => {

        addContractCloseModalFunction = closeModalFunction;
        modalElement.querySelector("form").addEventListener("submit", submitFunction);

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
      }
    });
  });
})();
