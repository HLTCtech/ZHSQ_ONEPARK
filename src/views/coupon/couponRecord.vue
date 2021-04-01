<!--
 * @Author: 周鹏飞
 * @Date: 2021-03-31 15:05:51
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-01 17:25:04
 * @Description: file content
-->
<template>
	<div class="box">
		<div>
			<el-select
				v-model="formList.item"
				placeholder="请选择"
			>
				<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>
			<el-input
				placeholder="请输入房源"
				v-model="formList.houseId"
				clearable
			>
			</el-input>
			<el-button
				class="search"
				type="primary"
				@click="searchBtn"
			>搜索</el-button>
		</div>
		<el-table
			:data="tableData"
			stripe
			style="width: 100%"
			border
		>
			<el-table-column
				prop="id"
				label="ID"
				width="50"
			>
			</el-table-column>
			<el-table-column
				prop="deduction_date"
				label="抵扣日期"
				width="180"
			>
			</el-table-column>
			<el-table-column
				prop="item"
				label="使用项目"
				width="80"
			>
			</el-table-column>
			<el-table-column
				prop="building"
				label="使用优惠券的楼层"
				width="150"
			>
			</el-table-column>
			<el-table-column
				prop="unit"
				label="使用优惠券的单元"
				width="150"
			>
			</el-table-column>
			<el-table-column
				prop="houseNum"
				label="使用优惠券的房间号"
				width="180"
			>
			</el-table-column>
			<el-table-column
				prop="use_amount"
				label="使用的金额"
				width="100"
			>
			</el-table-column>
			<el-table-column
				prop="coupons_id"
				label="绑定的id"
				width="100"
			>
			</el-table-column>
			<el-table-column
				prop="oper_name"
				label="操作人"
			>
			</el-table-column>

		</el-table>
		<div class="pagination">
			<el-pagination
				background
				layout="prev, pager, next"
				:total="total"
			>
			</el-pagination>
		</div>

	</div>

</template>

<script>
	import { couponsRecord } from "@/api/coupons";
	export default {
		data() {
			return {
				formList: {
					pageNum: 1,
					pageSize: 10,
					item: "",
					houseId: "",
				},
				total: 1,
				tableData: [],
				options: [
					{
						value: "尚郡",
						label: "尚郡",
					},
					{
						value: "壹號院",
						label: "壹號院",
					},
					{
						value: "澜院",
						label: "澜院",
					},
				],
			};
		},
		mounted() {
			this.getList();
		},
		methods: {
			// 加载页面
			getList() {
				couponsRecord(this.formList).then((res) => {
					console.log(res);
					this.tableData = res.data;
					this.total = res.total;
				});
			},
			// 搜索
			searchBtn() {
				this.getList();
			},
		},
	};
</script>


<style>
	.box {
		padding: 20px;
	}
	.el-input {
		width: 200px;
		margin-right: 20px;
		margin-bottom: 20px;
	}
	.pagination {
		margin-top: 20px;
		float: right;
	}
</style>