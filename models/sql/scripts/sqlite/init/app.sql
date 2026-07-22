pragma foreign_keys = ON;

begin;

/* menu */
insert into jsharmony.menu (menu_group, menu_id, menu_sts, menu_id_parent, menu_name, menu_seq, menu_desc, menu_desc_ext, menu_desc_ext2, menu_cmd, menu_image, menu_snotes, menu_subcmd) values ('S', 300, 'ACTIVE', 1, 'Customer', 300, 'Customers', null, null, 'Cust_Listing', null, null, null);
insert into jsharmony.menu (menu_group, menu_id, menu_sts, menu_id_parent, menu_name, menu_seq, menu_desc, menu_desc_ext, menu_desc_ext2, menu_cmd, menu_image, menu_snotes, menu_subcmd) values ('S', 30001, 'ACTIVE', 300, 'Customer/Cust_Listing', 30001, 'Customer Listing', null, null, 'Cust_Listing', null, null, null);
insert into jsharmony.sys_menu_role (menu_id, sys_role_name) values (300, '*');
insert into jsharmony.sys_menu_role (menu_id, sys_role_name) values (30001, '*');

update jsharmony.menu set menu_cmd='Client/Dashboard' where menu_id=200 and menu_cmd='jsHarmonyFactory/Client/Dashboard';
insert into jsharmony.menu (menu_group, menu_id, menu_sts, menu_id_parent, menu_name, menu_seq, menu_desc, menu_desc_ext, menu_desc_ext2, menu_cmd, menu_image, menu_snotes, menu_subcmd) values ('C', 280001, 'ACTIVE', 2800, 'Client/Admin/Settings', 280001, 'Settings', null, null, 'Client/Admin/Settings', null, null, null);
insert into jsharmony.cust_menu_role (menu_id, cust_role_name) values (280001, 'CSYSADMIN');


end;
