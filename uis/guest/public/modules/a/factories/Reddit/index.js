angular
    .module(module.name).factory(current.name, ['$rootScope', function(rootScope) {
        var Reddit = function(model) {
            this.items = [];
            this.busy = false;
            this.after = '';
            this.model = model;
        };

        Reddit.prototype.nextPage = function(model) {
            rootScope.isLoading = this.busy;
            if (this.busy) {
                return;
            }

            this.busy = true;
            var Model = model || this.model;
            return Model.getScrollData({
                after: this.after
            }).$promise.then(function(result) {
                var items = result;
                for (var i = 0; i < items.length; i++) {
                    this.items.push(items[i]);
                }
                this.after = this.items[this.items.length - 1].id || null;
                this.busy = false;
            }.bind(this));
        };

        return Reddit;
    }]);
