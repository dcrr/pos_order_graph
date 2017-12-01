function pos_order_graph_screens(instance, module){ //module is instance.point_of_sale
    var module   = instance.point_of_sale;
    var QWeb = instance.web.qweb;
    _t = instance.web._t;

    var round_pr = instance.web.round_precision;

    /*module.ReceiptScreenWidget = module.ReceiptScreenWidget.extend({
        refresh: function() {
            var order = this.pos.get('selectedOrder');
            $('.pos-receipt-container', this.$el).html(QWeb.render('PosInvoice',{
                    widget:this,
                    order: order,
                    orderlines: order.get('orderLines').models,
                    paymentlines: order.get('paymentLines').models,
                }));
                
        },
    });*/

    module.ClientListScreenWidget.include({

        show: function(){
            var self = this;
            this._super();
            this.renderElement();
            this.details_visible = false;
            this.old_client = this.pos.get('selectedOrder').get('client');
            this.new_client = this.old_client;

            this.$('.back').click(function(){
                self.pos_widget.screen_selector.back();
            });

            this.$('.next').click(function(){
                self.save_changes();
                self.pos_widget.screen_selector.back();
            });

            this.$('.new-customer').click(function(){
                self.display_client_details('edit',{
                    'country_id': self.pos.company.country_id,
                });
            });

            //var partners = this.pos.db.get_partners_sorted(1000);
            var partners = this.pos.partners;

            this.render_list(partners);

            this.reload_partners();

            if( this.old_client ){
                this.display_client_details('show',this.old_client,0);
            }

            this.$('.client-list-contents').delegate('.client-line','click',function(event){
                self.line_select(event,$(this),parseInt($(this).data('id')));
            });

            var search_timeout = null;

            if(this.pos.config.iface_vkeyboard && this.pos_widget.onscreen_keyboard){
                this.pos_widget.onscreen_keyboard.connect(this.$('.searchbox input'));
            }

            this.$('.searchbox input').on('keyup',function(event){
                clearTimeout(search_timeout);

                var query = this.value;

                search_timeout = setTimeout(function(){
                    self.perform_search(query,event.which === 13);
                },70);
            });

            this.$('.searchbox .search-clear').click(function(){
                self.clear_search();
            });
        },
        get_partner_by_id: function(id){
            var partners = this.pos.partners;
            var partnerFound = false;
            var i=0;
            while(!partnerFound && i< partners.length)
            {
                var partner = partners[i];
                if(partner.id == id)
                {
                    partnerFound = partner;
                }
                i = i+1;
            }
            return partnerFound ;
        },
        line_select: function(event,$line,id){
            var partner = this.get_partner_by_id(id);
            this.$('.client-list .lowlight').removeClass('lowlight');
            if ( $line.hasClass('highlight') ){
                $line.removeClass('highlight');
                $line.addClass('lowlight');
                this.display_client_details('hide',partner);
                this.new_client = null;
                this.toggle_save_button();
            }else{
                this.$('.client-list .highlight').removeClass('highlight');
                $line.addClass('highlight');
                var y = event.pageY - $line.parent().offset().top
                this.display_client_details('show',partner,y);
                this.new_client = partner;
                this.toggle_save_button();
            }
        },
    });
}
