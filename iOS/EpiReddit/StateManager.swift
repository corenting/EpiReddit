//
//  StateManager.swift
//  EpiReddit
//
//  Created by Corentin Garcia on 30/06/2018.
//  Copyright © 2018 Novus. All rights reserved.
//

import Foundation

struct StateManager {
    
    static func isLoggedIn() -> Bool {
        return getUsername() != ""
    }
    
    static func getUsername() -> String {
        if let username = UserDefaults.standard.string(forKey: "username") {
            return username
        }
        return ""
    }
    
    static func getJwtToken() -> String {
        if let jwt = UserDefaults.standard.string(forKey: "jwt") {
            return jwt
        }
        return ""
    }
    
    static func login(username: String, jwt: String) {
        UserDefaults.standard.set(username, forKey: "username")
        UserDefaults.standard.set(jwt, forKey: "jwt")
    }
    
    static func logout() {
        UserDefaults.standard.set("", forKey: "username")
        UserDefaults.standard.set("", forKey: "jwt")
    }
}
