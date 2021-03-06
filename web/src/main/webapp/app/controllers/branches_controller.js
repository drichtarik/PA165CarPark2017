Web.Controllers.BranchesController = function ($rootScope, $scope, $http, $mdDialog, notificationsService, contractConverter, settingsProvider, carService, branchesService, sessionManager) {
    var initList = function () {
        var request = new Web.Data.GetBranchesRequest();

        branchesService.getBranches(request, function (httpResponse) {
            var response = httpResponse.data;
            if (response !== null) {
                var data = response.data;
                if (response.isSuccess && data !== null) {
                    $scope.viewModel.branches = [];
                    for (var i = 0; i < data.length; i++) {
                        var toAdd = contractConverter.convertBranchToViewModel(data[i]);
                        $scope.viewModel.branches.push(toAdd);
                    }
                } else {
                    notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
                }
            } else {
                notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
            }
            $scope.viewModel.selectedEvent = null;
        }, function (httpResponse) {
            $scope.viewModel.selectedEvent = null;
            notificationsService.showSimple("BRANCHES.UNKNOWN_SERVER_ERROR");
        });
        var requestUsers = new Web.Data.GetUsersRequest();
        branchesService.getAllUsers(requestUsers, function (httpResponse) {
            var response = httpResponse.data;
            if (response !== null) {
                var data = response.data;
                if (response.isSuccess && data !== null) {
                    $scope.viewModel.users = [];
                    for (var i = 0; i < data.length; i++) {
                        var toAdd = contractConverter.convertUserToViewModel(data[i]);
                        $scope.viewModel.users.push(toAdd);
                    }
                } else {
                    notificationsService.showSimple("RESERVATIONS.UNKNOWN_ERROR");
                }
            } else {
                notificationsService.showSimple("RESERVATIONS.UNKNOWN_ERROR");
            }
            $scope.viewModel.selectedEvent = null;
        }, function (httpResponse) {
            $scope.viewModel.selectedEvent = null;
            notificationsService.showSimple("RESERVATIONS.UNKNOWN_SERVER_ERROR");
        });
        var request = new Web.Data.GetCarsRequest(sessionManager);
        if(sessionManager.currentSession.userType == 'ADMIN'){
            request.getAllCars = true;
        }
            carService.getCars(request, function (httpResponse) {
                var response = httpResponse.data;
                if (response !== null) {
                    var data = response.data;
                    if (response.isSuccess && data !== null) {
                        $scope.viewModel.cars = [];
                        var cars = []
                        for (var i = 0; i < data.length; i++) {
                            var toAdd = contractConverter.convertCarToViewModel(data[i]);
                            $scope.viewModel.cars.push(toAdd);
                        }
                        //callback(cars);
                    } else {
                        notificationsService.showSimple("RESERVATIONS.UNKNOWN_ERROR");
                    }
                } else {
                    notificationsService.showSimple("RESERVATIONS.UNKNOWN_ERROR");
                }
            }, function (httpResponse) {
                notificationsService.showSimple("RESERVATIONS.UNKNOWN_SERVER_ERROR");
        });
    }

    $scope.actions = new Object();
    $scope.actions.deleteSelectedRegionalBranch = function () {
        if ($scope.viewModel.selectedItem !== null) {
            var selectedEvent = $scope.viewModel.selectedItem;
            var selectedHashKey = $scope.viewModel.selectedItem.$$hashKey;
            for(var i = 0; i < $scope.viewModel.branches.length; i++) {
                if ($scope.viewModel.branches[i].$$hashKey === selectedHashKey) {
                    var request = {id: $scope.viewModel.selectedItem.id};
                    branchesService.deleteBranch(request, function (httpResponse) {
                        var response = httpResponse.data;
                        if (response !== null) {
                            var data = response.data;
                            if (response.isSuccess && data !== null) {
                                $scope.viewModel.branches.splice(i, 1);
                            } else {
                                notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
                            }
                        } else {
                            notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
                        }
                    }, function (httpResponse) {
                        notificationsService.showSimple("BRANCHES.UNKNOWN_SERVER_ERROR");
                    });
                }
            }
            $scope.viewModel.selectedItem = null;
            $scope.viewModel.manager = null;
        }
    };
    
    $scope.actions.showAddBranchDialog = function (ev) {
        $scope.viewModel.isBeingAdded = true;
        $scope.viewModel.addBranch = new Web.ViewModels.BranchesViewModel();
        angular.forEach($scope.viewModel.cars, function(car){
            car.selected = false;
        })
        $mdDialog.show({
            contentElement: '#addBranchDialog',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };
    
    $scope.actions.openAssignCar = function (ev) {
        $scope.viewModel.carToAssign = new Web.ViewModels.CarViewModel();
        $mdDialog.show({
            contentElement: '#assignCarDialog',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };
    
    $scope.actions.openAssignUser = function (ev) {
        $scope.viewModel.userToAssign = new Web.ViewModels.UserViewModel();
        $mdDialog.show({
            contentElement: '#assignUserDialog',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };
    
    $scope.actions.assignUser = function () {
        var branchToUpdate = $scope.viewModel.selectedItem;
        var userToBeAssigned = $scope.viewModel.userToAssign;
        var request = {id: $scope.viewModel.selectedItem.id, user: $scope.viewModel.userToAssign};
        branchesService.assignUser(request, function (httpResponse) {
            var response = httpResponse.data;
            if (response !== null) {
                var data = response.data;
                if (response.isSuccess && data !== null) {
                    branchToUpdate.employees.push(userToBeAssigned);
                } else {
                    notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
                }
            } else {
                notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
            }
            $scope.$digest();
        }, function (httpResponse) {
            notificationsService.showSimple("BRANCHES.UNKNOWN_SERVER_ERROR");
        });
        $scope.viewModel.userToAssign = null;
        $mdDialog.cancel();
    };
    
    $scope.actions.assignCar = function () {
        var branchToUpdate = $scope.viewModel.selectedItem;
        var carToBeAssigned = $scope.viewModel.carToAssign;
        var request = {id: $scope.viewModel.selectedItem.id, car: carToBeAssigned};
        branchesService.assignCar(request, function (httpResponse) {
            var response = httpResponse.data;
            if (response !== null) {
                var data = response.data;
                if (response.isSuccess && data !== null) {
                    branchToUpdate.cars.push(carToBeAssigned);
                } else {
                    notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
                }
            } else {
                notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
            }
            $scope.$digest();
        }, function (httpResponse) {
            notificationsService.showSimple("BRANCHES.UNKNOWN_SERVER_ERROR");
        });
        $scope.viewModel.carToAssign = null;
        $mdDialog.cancel();
    };
    
    $scope.actions.addBranch = function () {
        /*var selectedCars = [];
        angular.forEach($scope.viewModel.cars, function(car){
            if (car.selected) selectedCars.push(car);
        })*/
        var managerToSet = $scope.viewModel.manager;
        var request = {name: $scope.viewModel.addBranch.name};
        branchesService.createBranch(request, function (httpResponse) {
            var response = httpResponse.data;
            if (response !== null) {
                var data = response.data;
                if (response.isSuccess && data !== null) {
                    angular.forEach($scope.viewModel.cars, function(car){
                        if (car.selected) {
                            $scope.viewModel.selectedItem = data.data;
                            $scope.viewModel.carToAssign = car;
                            $scope.actions.assignCar();
                            data.data.cars.push(car);
                        };
                    })
                    $scope.viewModel.selectedItem = data.data;
                    $scope.viewModel.userToAssign = managerToSet;
                    data.data.employees.push(managerToSet);
                    $scope.actions.assignUser();
                    $scope.viewModel.branches.push(data.data);
                } else {
                    notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
                }
            } else {
                notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
            }
        }, function (httpResponse) {
            notificationsService.showSimple("BRANCHES.UNKNOWN_SERVER_ERROR");
        });
        $scope.viewModel.addBranch = null;
        $scope.viewModel.manager = null;
        $scope.viewModel.isBeingEdited = false;
        $scope.viewModel.isBeingAdded = false;
        $mdDialog.cancel();
    }
    
    $scope.actions.updateBranch = function () {
        var managerToSet = $scope.viewModel.manager;
        var selectedCars = [];
        angular.forEach($scope.viewModel.cars, function(car){
            if (car.selected) selectedCars.push(car);
        })
        var request = {id: $scope.viewModel.addBranch.id, name: $scope.viewModel.addBranch.name, cars: selectedCars};
        branchesService.updateBranch(request, function (httpResponse) {
            var response = httpResponse.data;
            if (response !== null) {
                var data = response.data;
                if (response.isSuccess && data !== null) {
                    /*angular.forEach($scope.viewModel.cars, function(car){
                        if (car.selected) {
                            $scope.viewModel.selectedItem = data.data;
                            $scope.viewModel.carToAssign = car;
                            $scope.actions.assignCar();
                            data.data.cars.push(car);
                        };
                    })
                    $scope.viewModel.selectedItem = data.data;
                    $scope.viewModel.userToAssign = managerToSet;
                    data.data.employees.push(managerToSet);
                    $scope.actions.assignUser();*/
                    //$scope.viewModel.branches.push(data.data);
                } else {
                    notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
                }
            } else {
                notificationsService.showSimple("BRANCHES.UNKNOWN_ERROR");
            }
        }, function (httpResponse) {
            notificationsService.showSimple("BRANCHES.UNKNOWN_SERVER_ERROR");
        });
        $scope.viewModel.addBranch = null;
        $scope.viewModel.manager = null;
        $scope.viewModel.isBeingEdited = false;
        $scope.viewModel.isBeingAdded = false;
        $mdDialog.cancel();
    }
    
    $scope.actions.editSelectedBranch = function (ev) {
        $scope.viewModel.isBeingEdited = true;
        $scope.viewModel.addBranch = $scope.viewModel.selectedItem;
        $mdDialog.show({
            contentElement: '#addBranchDialog',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    }
    
    $scope.actions.cancelAddBranch = function () {
        $mdDialog.cancel();
        $scope.viewModel.selectedItem = null;
        $scope.viewModel.manager = null;
        $scope.viewModel.carToAssign = null;
        $scope.viewModel.userToAssign = null;
        $scope.viewModel.addBranch = null;
        $scope.viewModel.isBeingEdited = false;
        $scope.viewModel.isBeingAdded = false;
        angular.forEach($scope.viewModel.cars, function(car){
            car.selected = false;
        })
    }
    
    $scope.setSelected = function(item) {
        $scope.viewModel.selectedItem = item;
        angular.forEach($scope.viewModel.cars, function(car){
            angular.forEach(item.cars, function(itemCar){
                if (car.id === itemCar.id) car.selected = true;
            })
        })
        $scope.viewModel.manager = item.manager;
    }
    
    $rootScope.pageSubtitle = "BRANCHES.PAGE_SUBTITLE";
    $scope.branchesList = $('#branches_list');
    $scope.viewModel = new Web.ViewModels.BranchesViewModel();
    $scope.viewModel.branches = [];
    $scope.viewModel.users = [];
    $scope.viewModel.cars = [];
    
    $scope.viewModel.selectedItem = null;
    $scope.viewModel.manager = null;
    $scope.viewModel.carToAssign = null;
    $scope.viewModel.userToAssign = null;
    
    $scope.viewModel.addBranch = null;
    $scope.viewModel.isBeingAdded = false;
    $scope.viewModel.isBeingEdited = false;
    initList();
}
angular.module('CarParSystemWebApp').controller('BranchesController', ['$rootScope', '$scope', '$http', '$mdDialog', 'notificationsService', 'contractConverter', 'settingsProvider', 'carsService', 'branchesService', 'sessionManager', Web.Controllers.BranchesController]);