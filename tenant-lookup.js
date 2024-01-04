var lookupForm = $("#lookupForm");
var domainNameField = $("#domainName");
var lookupButton = $("#submitLookupButton");
var lookupLoader = $("#submitLookupButtonSpinner");
var notFound = $("#notFoundBox");
var errorAlert = $("#errorAlert");
var resultsCard = $("#resultsCard");
var tenantIdRegex = /^https:\/\/login\.microsoftonline\.(?:us|com)\/([\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12})\/oauth2\/authorize$/;

//Results TExts
var tenantIdSpan = $("#tenantId");
var tenantRegionSpan = $("#region");
var tenantScopeSpan = $("#scope");
var entraReturnError = $("#entra-return-error");
function startLoading() {
    lookupButton.addClass("disabled");
    lookupLoader.removeClass("d-none");
}

function stopLoading() {
    lookupButton.removeClass("disabled");
    lookupLoader.addClass("d-none");
}

function clearConditionalDivs() {
    if(! notFound.hasClass('d-none')) {
        notFound.addClass('d-none');
    }
    if(! resultsCard.hasClass('d-none')) {
        resultsCard.addClass('d-none');
    }
    if(domainNameField.hasClass('is-invalid')) {
        domainNameField.removeClass('is-invalid');
    }
    if(! errorAlert.hasClass('d-none')) {
        errorAlert.addClass('d-none');
    }
}

function copyTenantId()
{
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(tenantIdSpan.text());
    navigator.clipboard.writeText($temp.val());
    $temp.remove();
}

function lookupTenant() {
    clearConditionalDivs();
    var domainName = domainNameField.val();
    if(domainName === "") {
        stopLoading();
        domainNameField.addClass('is-invalid');
    } else {
        var lookupUrl = "https://login.microsoftonline.com/" + domainName + "/.well-known/openid-configuration";
        $.get(lookupUrl)
            .done(function(data) {
                var tenantAuthEndpoint = data.authorization_endpoint;
                var tenantId = tenantAuthEndpoint.match(tenantIdRegex);
                var tenantIdText = tenantId[1];

                tenantIdSpan.text(tenantIdText);
                var tenantRegion = '';
                switch (data.tenant_region_scope) {
                    case 'USGov':
                        tenantRegion = "Entra ID Government: Arlington";
                        break;
                    case 'USG':
                        tenantRegion = "Entra ID Government: Fairfax";
                        break;
                    case 'WW':
                        tenantRegion = "Entra ID Global";
                        break;
                    case 'NA':
                        tenantRegion = "Entra ID Global: North America";
                        break;
                    case 'EU':
                        tenantRegion = "Entra ID Global: Europe";
                        break;
                    case 'AS':
                        tenantRegion = "APAC";
                        break;
                    case 'OC':
                        tenantRegion = "Entra ID Global: Oceania";
                        break;
                    case 'DE':
                        tenantRegion = "Entra ID Germany";
                        break;
                    default:
                        tenantRegion = "Other (most likely Entra ID Global)";
                }

                tenantRegionSpan.text(tenantRegion);

                var tenantScope = '';
                switch (data.tenant_region_sub_scope) {
                    case 'DOD':
                        tenantScope = "DOD";
                        break;
                    case 'DODCON':
                        tenantScope = "GCC High";
                        break;
                    case 'GCC':
                        tenantScope = "GCC";
                        break;
                    default:
                        if (tenantRegion == "USGOV") {
                            tenantScope = "Untagged";
                        }
                        else {
                            tenantScope = "Not applicable";
                        }
                }

                tenantScopeSpan.text(tenantScope);
                resultsCard.removeClass('d-none');

            })
            .fail(function(xhr,status,error) {
                console.log(xhr);
                if(xhr.status == 400) {
                    notFound.removeClass('d-none');
                    entraReturnError.text(xhr.responseJSON.error);
                } else {
                    errorAlert.removeClass('d-none');
                }
                
            });
        stopLoading();
    }
}