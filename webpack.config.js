const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var path = require('path');
module.exports = {
	entry: './src/views/index.js',
	module : {

		rules : [
			{
				test : /\.html$/,
				use : [
					{
						loader : "html-loader",
						options : {
							minimize : true
						}
					}
				]
			},
			{
				test: /\.css$/,
				use : [
					'style-loader',
					'css-loader'
				]
				
			},
			{
				
				test: /\.json/,
				type: 'javascript/auto',
				loader : 'json-loader'
			},
			{
				test: /\.(png|jpg|svg|gif|jpeg)$/,
				use : [
					'file-loader'
				]
				
			}
			,
			
			{
				test : /\.js$/,
				exclude:/node-modules/,
				use : [
					{
						loader : "babel-loader",
						
					}
				]
			}
		]
	},

	devServer: {
	  open: true
	},
	
	plugins : [
		new HtmlWebPackPlugin({
			template : "./src/views/index.html",
			filename : "./index.html"
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		
		})
	]
}