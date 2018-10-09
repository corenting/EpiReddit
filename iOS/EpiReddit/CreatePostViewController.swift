//
//  CreatePostViewController.swift
//  EpiReddit
//
//  Created by Rémi Faucheux on 04/07/2018.
//  Copyright © 2018 Novus. All rights reserved.
//

import UIKit
import Alamofire

class CreatePostViewController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource {

    @IBOutlet weak var catSelecter: UIPickerView!
    @IBOutlet weak var typeSelecter: UISegmentedControl!
    var categories = [Category]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        categories.remove(at: 0)
        catSelecter.delegate = self
        catSelecter.dataSource = self
        // Do any additional setup after loading the view.
    }
    
    @IBOutlet weak var titleLabel: UITextField!
    @IBOutlet weak var contentLabel: UITextField!
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return categories.count
    }
    
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        var cat:[String] = [String]()
        for item in categories {
            print(item.name)
            cat.append(item.name)
        }
        return cat[row]
    }
    
    @IBAction func createPostAction(_ sender: Any) {
        if (StateManager.isLoggedIn() && titleLabel.text != "" && contentLabel.text != "")
        {
            if (typeSelecter.selectedSegmentIndex == 0){
                let parameters: Parameters = [
                    "category_id" : categories[catSelecter.selectedRow(inComponent: 0)].id,
                    "title" : titleLabel.text!,
                    "content" : contentLabel.text!,
                    ]
                let headers: HTTPHeaders = [
                    "Authorization": "Bearer " + StateManager.getJwtToken()
                ]
                let url = Constants.baseUrl + "posts/selfpost"
                Alamofire.request(url, method: .post, parameters: parameters, headers: headers)
                    .responseJSON { response in
                        // check for errors
                        print(response)
                        guard response.result.error == nil && response.result.isSuccess else {
                            print("error")
                            return
                        }
                        self.backToMain()
                }
            }
            else {
                let parameters: Parameters = [
                    "category_id" : categories[catSelecter.selectedRow(inComponent: 0)].id,
                    "title" : titleLabel.text!,
                    "link" : contentLabel.text!,
                    ]
                let headers: HTTPHeaders = [
                    "Authorization": "Bearer " + StateManager.getJwtToken()
                ]
                let url = Constants.baseUrl + "posts/link"
                Alamofire.request(url, method: .post, parameters: parameters, headers: headers)
                    .responseJSON { response in
                        // check for errors
                        print(response)
                        guard response.result.error == nil && response.result.isSuccess else {
                            print("error")
                            return
                        }
                        self.backToMain()
                }
            }
        }
    }
    
    func backToMain(){
        navigationController?.popViewController(animated: true)
    }
    
    
    @IBOutlet weak var createButton: UIButton!
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
