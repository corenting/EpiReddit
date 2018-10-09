//
//  LoginRegisterViewController.swift
//  EpiReddit
//
//  Created by Corentin Garcia on 30/06/2018.
//  Copyright © 2018 Novus. All rights reserved.
//

import UIKit
import Alamofire

class LoginRegisterViewController: UIViewController {

    @IBOutlet weak var loginRegisterLabel: UILabel!
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var switchModeButton: UIButton!
    @IBOutlet weak var loginRegisterButton: UIButton!
    
    var isLoginMode = true
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        emailTextField.isHidden = true
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    @IBAction func loginRegisterClick(_ sender: Any) {
        var url = Constants.baseUrl
        if (isLoginMode) {
            url += "users/login"
        }
        else {
            url += "users/register"
        }
        
        var body = [
            "username": usernameTextField.text,
            "password": passwordTextField.text,
        ]
        
        if (!isLoginMode) {
            body["email"] = emailTextField.text
        }

        Alamofire.request(url, method: .post, parameters: body as? [String: Any], encoding: JSONEncoding.default)
            .responseJSON { response in
                // check for errors
                guard response.result.error == nil && response.result.isSuccess else {
                    self.onLoginRegisterDone(ok: false, response: [:])
                    return
                }
                
                // Get JSON
                guard let json = response.result.value as? [String: Any] else {
                    self.onLoginRegisterDone(ok: false, response: [:])
                    return
                }
                self.onLoginRegisterDone(ok: true, response: json)
        }
    }
    
    func onLoginRegisterDone(ok: Bool, response: [String: Any]) {
        
        // Display popup if error
        let error = response["error"] as? String
        if (!ok || error != nil) {
            let message = error != nil ? error : "Login or registration error, please verify the data entered!"
            let alert = UIAlertController(title: "Login/Register", message: message , preferredStyle: UIAlertControllerStyle.alert)
            let action = UIAlertAction(title: "OK", style: .default) { (action:UIAlertAction) in}
            alert.addAction(action)
            self.present(alert, animated: true, completion: nil)
            return
        }
        
        StateManager.login(username: usernameTextField.text!, jwt: response["token"] as! String)
        navigationController?.popViewController(animated: true)
    }
    
    @IBAction func switchModeClick(_ sender: Any) {
        isLoginMode = !isLoginMode
        
        if (isLoginMode) {
            loginRegisterLabel.text = "Login"
            loginRegisterButton.setTitle("Login", for: UIControlState.normal)
            emailTextField.isHidden = true
            switchModeButton.setTitle("Don't have an account ? Click here to register", for: UIControlState.normal)
        }
        else {
            loginRegisterLabel.text = "Register"
            loginRegisterButton.setTitle("Register", for: UIControlState.normal)
            emailTextField.isHidden = false
            switchModeButton.setTitle("Already have an account ? Click here to login", for: UIControlState.normal)
        }
    }
}
