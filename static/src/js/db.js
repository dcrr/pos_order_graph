function pos_order_graph_db(instance, module){
    var module   = instance.point_of_sale;

    module.PosDB.include({
        _partner_search_string: function(partner){
            var str =  this._super();
            alert(str);
            if(partner.ident_num){
                str += '|' + partner.ident_num;
            }
            str = '' + partner.id + ':' + str.replace(':','') + '\n';
            return str;
        },
    });
}
