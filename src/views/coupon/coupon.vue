<!--
 * @Author: 周鹏飞
 * @Date: 2021-03-31 15:05:51
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-02 11:27:10
 * @Description: file content
-->
<template>
	<div class="box">

		<div>
			<el-input
				class="search-input"
				placeholder="请输入领取人"
				v-model.trim="formList.receiveName"
				clearable
			>
			</el-input>
			<el-input
				class="search-input"
				placeholder="请输入房源"
				v-model.trim="formList.houseId"
				clearable
			>
			</el-input>
			<el-button
				class="search"
				type="primary"
				@click="searchBtn"
			>搜索</el-button>
			<el-button
				class="add"
				type="primary"
				@click="addBtn"
			>添加</el-button>

				
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
				prop="receive_date"
				label="领取日期"
				width="100"
			>
			</el-table-column>
			<el-table-column
				prop="receive_name"
				label="领取人"
				width="80"
			>
			</el-table-column>
			<el-table-column
				prop="consultant_name"
				label="置业顾问"
				width="100"
			>
			</el-table-column>
			<el-table-column
				prop="item"
				label="项目"
				width="100"
			>
			</el-table-column>
			<!-- <el-table-column
				prop="building"
				label="楼层"
				width="100"
			>
			</el-table-column>
			<el-table-column
				prop="unit"
				label="单元"
				width="100"
			>
			</el-table-column>
			<el-table-column
				prop="houseNum"
				label="房间号"
				width="100"
			>
			</el-table-column> -->
			<el-table-column
				prop="houseId"
				label="房源"
				width="80"
			>
			</el-table-column>
			<el-table-column
				prop="houseName"
				label="业主姓名"
				width="80"
			>
			</el-table-column>
			<el-table-column
				prop="total_amount"
				label="总金额"
				width="80"
			>
			</el-table-column>
			<el-table-column
				prop="surplus_amount"
				label="剩余金额"
				width="80"
			>
			</el-table-column>
			<el-table-column
				prop="use_amount"
				label="已使用金额"
		
				width="100"
			>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="{row}">
					<el-button
						class="editBtn"
						type="primary"
						@click="editBtn(row)"
					>编辑</el-button>
					<el-button
						type="danger"
						@click="deleteBtn(row.id)"
					>删除</el-button>
				</template>

			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination
				background
				layout="prev, pager, next"
				:total="total"
			>
			</el-pagination>
			<el-dialog
				title="添加优惠券"
				:visible.sync="dialogVisible"
				width="30%"
				:before-close="handleClose"
			>
				<el-form
					:label-position="labelPosition"
					label-width="80px"
					:model="formLabelAlign"
					:rules="rules"
					ref="formLabelAlign"
				>
					<el-form-item
						label="领取日期"
						prop="receive_date"
					>
						<el-date-picker
							v-model="formLabelAlign.receive_date"
							type="date"
							placeholder="选择日期"
							value-format="yyyy-MM-dd"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item
						label="领取人"
						prop="receive_name"
					>
						<el-input v-model="formLabelAlign.receive_name"></el-input>
					</el-form-item>
					<el-form-item
						label="置业顾问"
						prop="consultant_name"
					>
						<el-input v-model="formLabelAlign.consultant_name"></el-input>
					</el-form-item>
					<el-form-item
						label="项目"
						prop="item"
					>
						<el-select
							v-model="formLabelAlign.item"
							placeholder="请选择项目"
						>
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item
						label="楼层"
						prop="building"
					>
						<el-input v-model="formLabelAlign.building"></el-input>
					</el-form-item>
					<el-form-item
						label="单元"
						prop="unit"
					>
						<el-input v-model="formLabelAlign.unit"></el-input>
					</el-form-item>
					<el-form-item
						label="房间号"
						prop="houseNum"
					>
						<el-input v-model="formLabelAlign.houseNum"></el-input>
					</el-form-item>
					<el-form-item
						label="业主姓名"
						prop="houseName"
					>
						<el-input v-model="formLabelAlign.houseName"></el-input>
					</el-form-item>
					<el-form-item
						label="总金额"
						prop="total_amount"
					>
						<el-input v-model.number="formLabelAlign.total_amount" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
					</el-form-item>

				</el-form>
				<span
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="submitForm('formLabelAlign')"
					>确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog
				title="修改优惠券"
				:visible.sync="editDialogVisible"
				width="30%"
				:before-close="handleClose"
			>
				<el-form
					:label-position="labelPosition"
					label-width="100px"
					:model="editFormLabelAlign"
					:rules="rules"
					ref="editFormLabelAlign"
				>
					<el-form-item
						label="领取日期"
						prop="receive_date"
					>
						<el-date-picker
							v-model="editFormLabelAlign.receive_date"
							type="date"
							placeholder="选择日期"
							value-format="yyyy-MM-dd"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item
						label="领取人"
						prop="receive_name"
					>
						<el-input v-model="editFormLabelAlign.receive_name"></el-input>
					</el-form-item>
					<el-form-item
						label="置业顾问"
						prop="consultant_name"
					>
						<el-input v-model="editFormLabelAlign.consultant_name"></el-input>
					</el-form-item>
					<el-form-item
						label="项目"
						prop="item"
					>
						<el-select
							v-model="editFormLabelAlign.item"
							placeholder="请选择项目"
						>
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item
						label="楼层"
						prop="building"
					>
						<el-input type="number"  v-model.number="editFormLabelAlign.building"></el-input>
					</el-form-item>
					<el-form-item
						label="单元"
						prop="unit"
					>
						<el-input type="number"  v-model.number="editFormLabelAlign.unit"></el-input>
					</el-form-item>
					<el-form-item
						label="房间号"
						prop="houseNum"
					>
						<el-input type="number"  v-model.number="editFormLabelAlign.houseNum"></el-input>
					</el-form-item>
					<el-form-item
						label="业主姓名"
						prop="houseName"
					>
						<el-input v-model="editFormLabelAlign.houseName"></el-input>
					</el-form-item>
					<el-form-item
						label="剩余金额"
						prop="total_amount"
						
					>
						<el-input type="number" v-model.number="editFormLabelAlign.surplus_amount" ></el-input>
					</el-form-item>
					<el-form-item
						label="已使用金额"
						prop="total_amount"
						
					>
						<el-input type="number" v-model.number="editFormLabelAlign.use_amount"
						></el-input>
					</el-form-item>
					<el-form-item
						label="总金额"
						prop="total_amount"
						
					>
						<el-input
						type="number"
							v-model.number="editFormLabelAlign.total_amount"
							:disabled="true"
						></el-input>
					</el-form-item>

				</el-form>
				<span
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="editDialogVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="editSubmitForm('editFormLabelAlign')"
					>确 定</el-button>
				</span>
			</el-dialog>
		</div>

	</div>

</template>

<script>
	import FilenameOption from "@/views/excel/components/FilenameOption";
	import { addCoupons, coupons, delCoupon, editCoupons,upload } from "@/api/coupons";
	import { objectMerge } from "@/utils";
	export default {
		components: {  FilenameOption },
		data() {
				var validateHZ = (rule, value, callback) => {
				var reg=/^[\u4e00-\u9fa5]+$/
        if (!reg.test(value)) {
          callback(new Error('请输入汉字'));
        } else {
          callback();
        }
      };
			return {
				downloadLoading: false,
				filename: "",
				// 日期
				value1: "",
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
				labelPosition: "right",
				formLabelAlign: {
					// name: "",
					// region: "",
					// type: "",
				},
				editFormLabelAlign: {},
				editDialogVisible: false,
				dialogVisible: false,
				formList: {
					pageNum: 1,
					pageSize: 10,
					receiveName: "",
					houseId: "",
				},
				total: 1,
				tableData: [],
				rules: {
					receive_date: [
						{
							required: true,
							message: "请选择日期",
							trigger: "blur",
						},
					],
					receive_name: [
						{
							required: true,
							message: "请输入领取人",
							trigger: "blur",
						},
						{ validator: validateHZ, trigger: 'blur' }
					],
					consultant_name: [
						{
							required: true,
							message: "请输入置业顾问",
							trigger: "blur",
						},
						{ validator: validateHZ, trigger: 'blur'}
					],
					item: [
						{
							required: true,
							message: "请选择项目",
							trigger: "blur",
						},
					],
					building: [
						{
							required: true,
							message: "请输入楼层(数字)",
							trigger: "blur",
						},
					 { type: 'number',  message: '楼层必须为数字值',trigger:['blur','change']}
					],
					unit: [
						{
							required: true,
							message: "请输入单元(数字)",
							trigger: "blur",
						},
						{ type: 'number',  message: '单元必须为数字值',trigger:['blur','change']}

					],
					houseNum: [

						{
							required: true,
							message: "请输入房间号(数字)",
							trigger: "blur",
						},
							{ type: 'number',  message: '房间号必须为数字值',trigger:['blur','change']}
					],
					houseName: [
						{
							required: true,
							message: "请输入业主姓名",
							trigger: "blur",
						},
						{ validator: validateHZ, trigger: 'blur' }
					],
					total_amount: [
						{
							required: true,
							message: "请输入总金额",
							trigger: "blur",
						},
						{ type: 'number',  message: '金额必须为数字值',trigger:['blur','change']}
					],
					surplus_amount: [
						{
							required: true,
							message: "请输入剩余金额", 
							trigger: "blur",
						},
						{ type: 'number',  message: '金额必须为数字值',trigger:['blur','change']}
					],
					use_amount: [
						{
							required: true,
							message: "请输入已使用金额",
							trigger: "blur",
						},
							{ type: 'number',  message: '金额必须为数字值',trigger:['blur','change']}
					],
				},
			};
		
		},
		mounted() {
			this.getList();
		},
		watch: {
			//监听
			editFormLabelAlign: {
				handler(newval, oldval) {
					this.editFormLabelAlign.total_amount =
						Number(newval.surplus_amount) + Number(newval.use_amount);
				},
				deep: true,
			},
		},
		methods: {
				handleRequest(param) {
				const fileObj = param.file;
				// FormData 对象
				const form = new FormData();
				// 文件对象
				form.append("file", fileObj);
				upload(form).then((res) => {
					console.log(res);
					if (res.code == 200 && res.msg !== "重复上传") {
						this.$message.success("上传成功");
					} else {
						this.$message.error(res.msg);
					}
				});
			},
			submitForm(ruleForm) {
				this.$refs[ruleForm].validate((valid) => {
					if (valid) {
						addCoupons(this.formLabelAlign).then((res) => {
							this.dialogVisible = false;
							this.$message("添加成功");
							this.getList();
							this.formLabelAlign = {};
						});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			// 删除
			deleteBtn(id) {
				this.$confirm("此操作将永久删除, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						delCoupon({ id: id }).then((res) => {
							this.getList();
						});
						this.$message({
							type: "success",
							message: "删除成功!",
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			},
			// 添加优惠券
			addBtn() {
				this.dialogVisible = true;
			},
			handleClose(done) {
				this.$confirm("确认关闭？")
					.then((_) => {
						done();
					})
					.catch((_) => {});
			},
			// 加载页面
			getList() {
				coupons(this.formList).then((res) => {
					this.tableData = res.data;
					this.total = res.total;
				});
			},
			// 搜索
			searchBtn() {
				this.getList();
			},
			// 编辑
			editBtn(data) {
				this.editDialogVisible = true;
				this.editFormLabelAlign = Object.assign({}, data);
			},
			// 编辑提交
			editSubmitForm(editFormLabelAlign) {
				this.$refs[editFormLabelAlign].validate((valid) => {
					if (valid) {
						editCoupons(this.editFormLabelAlign).then((res) => {
							this.editDialogVisible = false;
							this.$message("修改成功");
							this.getList();
							setTimeout(function () {
								this.editFormLabelAlign = {};
							}, 2000);
						});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
				handleDownload() {
				this.downloadLoading = true;
				import("@/vendor/Export2Excel").then((excel) => {
					const tHeader = [

						"领取日期",
						"领取人",
						"置业顾问",
						"项目",
						"房源",
						"姓名",
						"总金额",
					
					];
					const filterVal = [

						"",
						"",
						"",
						"",
						"",
						"",
						"",


						
					];
					const list = this.tableData;
					console.log(list);
					const data = this.formatJson(filterVal, list);
					console.log(data);
					excel.export_json_to_excel({
						header: tHeader,
						data,
						filename: this.filename,
						autoWidth: this.autoWidth,
						bookType: this.bookType,
					});
					this.downloadLoading = false;
				});
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map((v) =>
					filterVal.map((j) => {
						if (j === "timestamp") {
							return parseTime(v[j]);
						} else {
							return v[j];
						}
					})
				);
			},
		},
	};
</script>


<style  lang="scss" scoped>
	.box {
		padding: 20px;
		.search-input {
			width: 200px;
			margin-right: 20px;
			margin-bottom: 20px;
		}
	}

	.pagination {
		margin-top: 20px;
		float: right;
	}
	.editBtn {
		margin-right: 10px;
	}
</style>